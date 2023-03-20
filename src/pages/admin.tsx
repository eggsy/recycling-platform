import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  TbCategory,
  TbSitemap,
  TbLogin,
  TbHome,
  TbDeviceFloppy,
  TbX,
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
    results?: string[];
    benefits?: string[];
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
    setLoading(true);

    const path = which === "category" ? "categories" : "items";
    const dataObject: {
      name: string;
      image: string;
      decomposeTime?: string;
      categoryId?: string;
      results?: string[];
      benefits?: string[];
    } = {
      name: data[which].name,
      image: data[which].image,
    };

    if (which === "item") {
      dataObject["decomposeTime"] = data[which].decomposeTime;
      dataObject["categoryId"] = data[which].categoryId;
      dataObject["benefits"] = data[which].benefits;
      dataObject["results"] = data[which].results;
    }

    const result = await addDoc(collection(firestore, path), dataObject).catch(
      (err) => {
        toast.error(err.message);
        setLoading(false);
      }
    );

    if (result?.id) {
      toast.success(`Item/category added successfully!`);
      router.reload();
    }

    setLoading(false);
  };

  return (
    <Layout
      title="Admin Controls"
      rightSide={
        <button
          className="flex items-center space-x-1 rounded-lg bg-green-600/20 px-4 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-600/40 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/50"
          title="Save"
          aria-label="Save button"
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

            <section className="space-y-2">
              <h1 className="text-xs font-semibold uppercase">Details</h1>

              <AnimatePresence mode="wait" initial={false}>
                {which === "category" && <CategoryForm setData={setData} />}
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
          title="Go home"
          aria-label="Go home button"
          onClick={() => router.replace("/")}
        >
          <TbHome />
          <span>Go Home</span>
        </button>

        <button
          type="button"
          className="flex items-center space-x-2 rounded-lg bg-white  px-4 py-2 text-sm text-black"
          title="Sign in"
          aria-label="Sign in button"
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
      title={title}
      aria-label={`${title} button`}
      onClick={() => handleClick()}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

/* Forms */
const CategoryForm = ({ setData }: { setData: any }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    setData((p: any) => ({
      ...p,
      category: {
        name,
        image,
      },
    }));
  }, [name, image, setData]);

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
      className="space-y-4 md:w-1/3"
    >
      <Input
        label="Category Name"
        placeholder="Enter the category name"
        value={name}
        setValue={setName}
      />

      <FileInput value={image} setValue={setImage} label="Category Image" />
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
  const [results, setResults] = useState([]);
  const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    setData((p: any) => ({
      ...p,
      item: {
        name,
        decomposeTime,
        image,
        categoryId,
        results,
        benefits,
      },
    }));
  }, [name, categoryId, decomposeTime, image, results, benefits, setData]);

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
      className="grid gap-4 md:grid-cols-3"
    >
      <section className="space-y-4">
        <Input
          label="Name"
          placeholder="Name"
          value={name}
          setValue={setName}
        />

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
      </section>

      <InputGroup
        label="Results"
        value={results}
        setValue={setResults}
        placeholder="(e.g. Increased waste and pollution)"
      />

      <InputGroup
        label="Benefits"
        value={benefits}
        setValue={setBenefits}
        placeholder="(e.g. Save energy)"
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
  onKeyDown,
  disabled,
  grow,
}: {
  label?: string;
  placeholder: string;
  value: string;
  setValue?: any;
  disabled?: boolean;
  grow?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={clsx("flex flex-col space-y-1", grow && "flex-grow")}>
      {label && (
        <label className="text-xs font-semibold uppercase text-black/50">
          {label}
        </label>
      )}

      <input
        type="text"
        className="block w-full rounded-md border-black/30 text-sm outline-none transition-colors focus:border-black/50 focus:ring-0 disabled:cursor-not-allowed disabled:bg-white/50 disabled:text-black/50"
        placeholder={placeholder}
        value={value}
        required
        onChange={(e) => setValue?.(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
    </div>
  );
};

const InputGroup = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string[];
  setValue: any;
}) => {
  const [activeValue, setActive] = useState("");

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setValue([...value, activeValue]);
      setActive("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <div className="space-y-1">
        {value.map((val, index) => (
          <div key={val} className="flex items-center space-x-2">
            <Input
              key={val}
              value={val}
              placeholder={placeholder}
              grow
              disabled
            />

            <button
              type="button"
              title="Delete"
              aria-label="Delete this item"
              className="rounded-lg bg-red-600/20 p-1.5 text-2xl text-red-600 transition-colors hover:bg-red-600/40"
              onClick={() => {
                setValue(value.filter((_, i) => i !== index));
              }}
            >
              <TbX />
            </button>
          </div>
        ))}

        <Input
          value={activeValue}
          setValue={setActive}
          placeholder={placeholder}
          onKeyDown={handleEnter}
        />
      </div>

      <span className="mt-2 block text-center text-xs text-black/30">
        press enter to add more
      </span>
    </div>
  );
};

const Select = ({
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
        const downloadLink = await getDownloadURL(uploadTask.snapshot.ref);

        setValue(downloadLink);
        load(downloadLink);
        unsubscribe();
      }
    );
  };

  const removeImage = async () => {
    if (!value) return;
    const storageRef = ref(storage, value);

    await deleteObject(storageRef)
      .then(() => setValue(""))
      .catch((err) => {
        toast.error(err.message);
      });

    setValue("");
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
