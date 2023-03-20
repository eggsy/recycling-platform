import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  TbCategory,
  TbSitemap,
  TbLogin,
  TbHome,
  TbDeviceFloppy,
} from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import clsx from "clsx";
import { authAtom } from "@/store/auth";
import { NextRouter, useRouter } from "next/router";
import { signInPopup, storage, firestore } from "@/lib/firebase";
import { FilePond } from "react-filepond";
import type { ProcessServerConfigFunction } from "filepond";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Styles
import "filepond/dist/filepond.min.css";

// Store
import { categoriesAtom, ICategory } from "@/store/categories";

// Components
import { Layout } from "@/components/Layout";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "sonner";

interface IData {
  category: {
    image: string;
    name: string;
  };
  item: {
    name: string;
    decomposeTime: string;
    image: string;
    categoryId: string;
  };
}

export default function Admin() {
  const [categories] = useAtom(categoriesAtom);
  const [which, setWhich] = useState<"category" | "item">("category");
  const [authCache] = useAtom(authAtom);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IData>({} as IData);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.which) return;
    setWhich(router.query.which as "category" | "item");
  }, [router.query.which]);

  const isDisabled = useMemo(() => {
    if (!data[which]) return true;

    if (which === "item")
      return !(
        data.item.name &&
        data.item.decomposeTime &&
        data.item.image &&
        data.item.categoryId
      );
    else return !(data.category.name && data.category.image);
  }, [data, which]);

  const handleSave = async () => {
    if (which === "item") {
      setLoading(true);

      const result = await addDoc(collection(firestore, "items"), {
        name: data.item.name,
        decomposeTime: data.item.decomposeTime,
        image: data.item.image,
        categoryId: data.item.categoryId,
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });

      if (result?.id) {
        toast.success("Item added successfully!");
        router.reload();
      }

      setLoading(false);
    }
  };

  return (
    <Layout
      title="Admin Controls"
      rightSide={
        <button
          className="flex items-center space-x-1 rounded-lg bg-green-600/20 px-4 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-600/40 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/50"
          title="Save"
          disabled={loading || isDisabled}
          onClick={handleSave}
        >
          <TbDeviceFloppy />
          <span>Save</span>
        </button>
      }
    >
      <AnimatePresence mode="wait">
        {!authCache.isAdmin && <NotAuthorized />}

        {authCache.isAdmin && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="space-y-8"
          >
            <section className="space-y-2">
              <h1 className="text-xs font-semibold uppercase">
                I want to add a
              </h1>
              <div className="flex gap-4">
                <ChooseButton
                  which={which}
                  title="Category"
                  icon={<TbCategory size={20} />}
                  setWhich={setWhich}
                  router={router}
                />

                <ChooseButton
                  which={which}
                  title="Item"
                  icon={<TbSitemap size={20} />}
                  setWhich={setWhich}
                  router={router}
                />
              </div>
            </section>

            <section className="space-y-2 md:w-1/3">
              <h1 className="text-xs font-semibold uppercase">Details</h1>

              <AnimatePresence mode="wait" initial={false}>
                {which === "category" && <CategoryForm />}
                {which === "item" && (
                  <ItemForm
                    categories={categories.categories}
                    setData={setData}
                  />
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

/* Overlay */
const NotAuthorized = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-10 flex min-h-[50vh] flex-col items-center justify-center space-y-4 rounded-lg bg-black/80 text-center text-2xl font-bold text-white md:min-h-0"
    >
      <span>You don{"'"}t have access to this page</span>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          className="flex items-center space-x-2 rounded-lg bg-white  px-4 py-2 text-sm text-black"
          onClick={() => router.replace("/")}
        >
          <TbHome />
          <span>Go Home</span>
        </button>

        <button
          type="button"
          className="flex items-center space-x-2 rounded-lg bg-white  px-4 py-2 text-sm text-black"
          onClick={() => signInPopup()}
        >
          <TbLogin />
          <span>Sign in</span>
        </button>
      </div>
    </motion.div>
  );
};

const ChooseButton = ({
  which,
  title,
  router,
  setWhich,
  icon,
}: {
  which: string;
  title: string;
  router: NextRouter;
  setWhich: any;
  icon: ReactNode;
}) => {
  const handleClick = () => {
    router.push("/admin", {
      query: {
        which: title.toLowerCase(),
      },
    });

    setWhich(title.toLowerCase());
  };

  return (
    <button
      type="button"
      className={clsx(
        "no-highlight flex items-center space-x-2 rounded-lg px-4 py-2 font-semibold transition-colors",
        which === title.toLowerCase()
          ? "bg-green-600/20 text-green-600"
          : "bg-black/5 hover:bg-black/10"
      )}
      onClick={() => handleClick()}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

/* Forms */
const CategoryForm = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      Category Form
    </motion.div>
  );
};

const ItemForm = ({
  categories,
  setData,
}: {
  categories: ICategory[];
  setData: any;
}) => {
  const [name, setName] = useState("");
  const [categoryId, setCategory] = useState("");
  const [decomposeTime, setDecompose] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    setData((p: any) => ({
      ...p,
      item: {
        name,
        decomposeTime,
        image,
        categoryId,
      },
    }));
  }, [name, categoryId, decomposeTime, image, setData]);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="space-y-4"
    >
      <Input label="Name" placeholder="Name" value={name} setValue={setName} />

      <Input
        label="Decompose Time"
        placeholder="(e.g. 2 years)"
        value={decomposeTime}
        setValue={setDecompose}
      />

      <FileInput value={image} setValue={setImage} label="Image" />

      <Select
        value={categoryId}
        setValue={setCategory}
        label="Category"
        placeholder="Select a category..."
        options={categories.map((c) => ({
          label: c.name,
          value: c.id,
        }))}
      />
    </motion.div>
  );
};

/* Elements */
const Input = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: any;
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <input
        type="text"
        className="block w-full rounded-md border-black/30 text-sm outline-none transition-colors focus:border-black/50 focus:ring-0"
        placeholder={placeholder}
        value={value}
        required
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const Select = ({
  value,
  setValue,
  label,
  placeholder,
  options,
}: {
  value: string;
  setValue: any;
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <select
        className="block w-full rounded-md border-black/30 text-sm outline-none transition-colors focus:border-black/30 focus:ring-0"
        required
        title={placeholder}
        defaultValue={placeholder}
        onChange={(e) => setValue(e.target.value)}
      >
        <option disabled>{placeholder}</option>

        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const FileInput = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: any;
}) => {
  const uploadImage: ProcessServerConfigFunction = async (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress
  ) => {
    const fileExtension = file.type.split("/")[1];
    const storageRef = ref(storage, `image-${Date.now()}.${fileExtension}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    const unsubscribe = uploadTask.on(
      "state_changed",
      (snapshot) => {
        progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
      },
      (err) => {
        error(err.message);
        toast.error(err.message);
        unsubscribe();
      },
      async () => {
        const ref = uploadTask.snapshot.ref;
        const downloadLink = await getDownloadURL(ref);

        setValue(downloadLink);
        load(ref.name);
        unsubscribe();
      }
    );
  };

  const removeImage = async () => {
    const storageRef = ref(storage, value);

    await deleteObject(storageRef)
      .then(() => setValue(""))
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <FilePond
        onremovefile={() => removeImage()}
        server={{
          process: uploadImage.bind(this),
          remove: () => removeImage(),
        }}
        acceptedFileTypes={["image/png"]}
        credits={false}
      />
    </div>
  );
};
