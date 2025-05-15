import axios from "axios";

export default async function fileUpload(
  e,
  setListItem,
  setLoading
) {



  // let files = e.target.files;
  // let allUploadedFiles = images;

  const fileToUri = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  if (e) {
    setLoading(true);

    // for (let i = 0; i < files.length; i++) {
    fileToUri(e, (err, result) => {
      if (result) {
        setListItem(result);
      }
    });
    // }
  }
}
