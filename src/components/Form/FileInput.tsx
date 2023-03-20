import { storage } from "@/lib/firebase";
import { FilePond } from "react-filepond";
import { ProcessServerConfigFunction } from "filepond";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { toast } from "sonner";

export const FileInput = ({
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
