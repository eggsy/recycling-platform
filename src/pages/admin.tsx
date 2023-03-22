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
import { firestore, signInPopup } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

// Styles
import "filepond/dist/filepond.min.css";

// Store
import { categoriesAtom, ICategory } from "@/store/categories";
import { itemsAtom, IItem } from "@/store/items";

// Components
import { Layout } from "@/components/Layout";
import { Select } from "@/components/Form/Select";
import { FileInput } from "@/components/Form/FileInput";
import { InputGroup } from "@/components/Form/InputGroup";
import { Input } from "@/components/Form/Input";

// Types
type Category = {
  image: string;
  name: string;
};

type Item = {
  name: string;
  decomposeTime: string;
  image: string;
  categoryId: string;
  results?: string[];
  benefits?: string[];
};

type ExtendExisting<T, U> = Omit<T, keyof U> & U;

interface IData {
  category: Category;
  item: Item;
  editCategory: ExtendExisting<Category, { id: string }>;
  editItem: ExtendExisting<Item, { id: string }>;
}

export default function Admin() {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [which, setWhich] = useState<
    "category" | "item" | "editCategory" | "editItem"
  >("category");
  const [authCache] = useAtom(authAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IData>({} as IData);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.which) return;
    setWhich(router.query.which as "category" | "item");
  }, [router.query.which]);

  const isDisabled = useMemo(() => {
    if (!data[which]) return true;

    if (which === "item" || which === "editItem")
      return !(
        data[which].name &&
        data[which].decomposeTime &&
        data[which].image &&
        data[which].categoryId &&
        (which === "editItem" ? data[which].id : true)
      );
    else
      return !(
        data[which].name &&
        data[which].image &&
        (which === "editCategory" ? data[which].id : true)
      );
  }, [data, which]);

  const handleSave = async () => {
    setLoading(true);

    const path = ["category", "editCategory"].includes(which)
      ? "categories"
      : "items";

    const dataObject: {
      name: string;
      image: string;
      decomposeTime?: string;
      id?: string;
      categoryId?: string;
      results?: string[];
      benefits?: string[];
    } = {
      name: data[which].name,
      image: data[which].image,
    };

    if (which === "item" || which === "editItem") {
      dataObject["decomposeTime"] = data[which].decomposeTime;
      dataObject["categoryId"] = data[which].categoryId;
      dataObject["benefits"] = data[which].benefits;
      dataObject["results"] = data[which].results;
    }

    if (which === "category" || which === "item") {
      await addDoc(collection(firestore, path), dataObject)
        .then((doc) => {
          toast.success(`Item/category added successfully!`);

          if (which === "category")
            setCategories((p) => ({
              ...p,
              categories: [
                ...p.categories,
                { id: doc.id, ...dataObject } as ICategory,
              ],
            }));
          else
            setItems((p) => ({
              ...p,
              items: [...p.items, { id: doc.id, ...dataObject } as IItem],
            }));
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
        });
    } else if (which === "editCategory" || which === "editItem") {
      await setDoc(doc(firestore, `${path}/${data[which].id}`), dataObject)
        .then(() => {
          if (which === "editCategory") {
            const cat = categories.categories.map((category) => {
              if (category.id === data[which].id)
                return { id: data[which].id, ...dataObject } as ICategory;
              else return category;
            });

            setCategories((p) => ({
              ...p,
              categories: cat,
            }));
          } else {
            const item = items.items.map((item) => {
              if (item.id === data[which].id)
                return { id: data[which].id, ...dataObject } as IItem;
              else return item;
            });

            setItems((p) => ({
              ...p,
              items: item,
            }));
          }

          toast.success(`Item/category edited successfully!`);
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
        });
    }

    setLoading(false);
  };

  return (
    <Layout
      title="Admin Controls"
      rightSide={
        <button
          className="flex items-center space-x-1 rounded-lg bg-green-600/20 px-4 py-1 text-sm font-medium text-green-600 transition-colors hover:bg-green-600/40 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/50"
          title={which.includes("edit") ? "Update" : "Save"}
          aria-label="Save button"
          disabled={loading || isDisabled}
          onClick={handleSave}
        >
          <TbDeviceFloppy />
          <span>{which.includes("edit") ? "Update" : "Save"}</span>
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
            <section className="flex flex-col gap-x-10 gap-y-4 md:flex-row md:items-center">
              <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row md:items-center">
                <span className="text-xs font-medium uppercase text-black/50">
                  Add a:
                </span>

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
              </div>

              <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row md:items-center">
                <span className="text-xs font-medium uppercase text-black/50">
                  Or:
                </span>

                <div className="flex gap-4">
                  <ChooseButton
                    which={which}
                    title="Edit Category"
                    icon={<TbCategory size={20} />}
                    setWhich={setWhich}
                    router={router}
                  />

                  <ChooseButton
                    which={which}
                    title="Edit Item"
                    icon={<TbCategory size={20} />}
                    setWhich={setWhich}
                    router={router}
                  />
                </div>
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

                {which === "editCategory" && (
                  <CategoryForm
                    categories={categories.categories}
                    setData={setData}
                    edit
                  />
                )}

                {which === "editItem" && (
                  <ItemForm
                    categories={categories.categories}
                    items={items.items}
                    setData={setData}
                    setCategories={setCategories}
                    edit
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
  const whichToSet = useMemo(
    () =>
      title
        .toLowerCase()
        .split(" ")
        .map((i, index) => (index !== 0 ? i[0].toUpperCase() + i.slice(1) : i))
        .join(""),
    [title]
  );

  const handleClick = () => {
    router.push("/admin", {
      query: {
        which: whichToSet,
      },
    });

    setWhich(whichToSet);
  };

  return (
    <button
      type="button"
      className={clsx(
        "no-highlight flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold outline-none transition-colors md:text-base",
        which === whichToSet
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
const CategoryForm = ({
  setData,
  categories,
  edit = false,
}: {
  setData: any;
  categories?: ICategory[];
  edit?: boolean;
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategory] = useState("");

  useEffect(() => {
    if (!edit) return;

    const category = categories?.find((i) => i.id === categoryId);
    if (!category) return;

    setName(category.name);
    setImage(category.image);
  }, [categoryId, edit, categories]);

  useEffect(() => {
    const keyToSet = edit ? "editCategory" : "category";

    const object: ExtendExisting<Category, { id?: string }> = {
      name,
      image,
    };

    if (edit) object.id = categoryId;

    setData((p: any) => ({
      ...p,
      [keyToSet]: object,
    }));
  }, [name, image, setData, edit, categoryId]);

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
      {edit && (
        <Select
          label="Category"
          placeholder="Select a category"
          value={categoryId}
          setValue={setCategory}
          options={categories?.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
        />
      )}

      <Input
        label="Name"
        placeholder="Enter the category name"
        value={name}
        setValue={setName}
      />

      <FileInput
        value={image}
        setValue={setImage}
        label={`Image ${image && "(upload to change)"}`}
      />
    </motion.div>
  );
};

const ItemForm = ({
  setData,
  setCategories,
  categories,
  items,
  edit = false,
}: {
  edit?: boolean;
  setCategories?: any;
  categories: ICategory[];
  items?: IItem[];
  setData: any;
}) => {
  const [name, setName] = useState("");
  const [categoryId, setCategory] = useState("");
  const [itemId, setItem] = useState("");
  const [decomposeTime, setDecompose] = useState("");
  const [image, setImage] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  useEffect(() => {
    if (!edit) return;

    setCategories?.((p: any) => ({
      ...p,
      selectedCategoryId: categoryId,
    }));
  }, [categoryId, edit, setCategories]);

  useEffect(() => {
    if (!edit) return;
    const item = items?.find((i) => i.id === itemId);

    if (!item) return;

    setName(item.name);
    setDecompose(item.decomposeTime);
    setImage(item.image);
    setResults(item.results || []);
    setBenefits(item.benefits || []);
  }, [itemId, items, edit]);

  useEffect(() => {
    const keyToSet = edit ? "editItem" : "item";

    const object: ExtendExisting<Item, { id?: string }> = {
      name,
      decomposeTime,
      image,
      categoryId,
      results,
      benefits,
    };

    if (edit) object.id = itemId;

    setData((p: any) => ({
      ...p,
      [keyToSet]: object,
    }));
  }, [
    edit,
    itemId,
    name,
    categoryId,
    decomposeTime,
    image,
    results,
    benefits,
    setData,
  ]);

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
        {edit && (
          <>
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

            <Select
              value={itemId}
              setValue={setItem}
              label="Item"
              placeholder="Select an item..."
              options={items?.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </>
        )}

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

        <FileInput
          value={image}
          setValue={setImage}
          label={`Image ${image && "(upload to change)"}`}
        />

        {!edit && (
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
        )}
      </section>

      <InputGroup
        label="Environmental damage"
        value={results}
        setValue={setResults}
        placeholder="(e.g. Water and air pollution.)"
      />

      <InputGroup
        label="When recycled properly"
        value={benefits}
        setValue={setBenefits}
        placeholder="(e.g. Saves energy.)"
      />
    </motion.div>
  );
};
