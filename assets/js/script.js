
const fileBox = document.querySelector(".file-box"),
  previewImg = fileBox.querySelector("img"),
  fileInput = fileBox.querySelector("input"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioInput = document.querySelector(".ratio input"),
  qualityInput = document.querySelector(".quality input"),
  downloadButton = document.querySelector(".download-button"),
  imgOriginal = document.querySelector(".original"),
  imgType = document.getElementById("imgType"),
  imgModficada = document.querySelector(".modificada"),
  adjustContent = document.querySelector(".adjust-content");

let originalImageRatio;
let imageType;
let nameTemp;
const today = new Date();


const loadFile = (e) => {
  adjustContent.classList.remove('hide');
  const file = e.target.files[0];
  imgOriginal.innerHTML = formatBytes(file.size);
  imageType = file.type;
  nameTemp = file.name.split(".")[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    originalImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".adjuster-wrapper").classList.add("active");
  });
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


widthInput.addEventListener("keyup", () => {
  const height = ratioInput.checked
    ? widthInput.value / originalImageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
});

imgType.addEventListener("change", () => {
  if (!imgType) {
    alert('extensão errada')
  } else {
    switch (imgType.value) {
      case 'jpeg':
        imageType = 'image/jpeg';
        break;
      case 'png':
        imageType = 'image/png';
        break;
      case 'webp':
        imageType = 'image/webp';
        break;
      case 'original':
        break;
    }
  }
});

heightInput.addEventListener("keyup", () => {
  const width = ratioInput.checked
    ? heightInput.value * originalImageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);
});

function formatDate(date, format) {
  const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      aa: date.getFullYear().toString().slice(-2),
      aaaa: date.getFullYear()
  }
  return format.replace(/dd|mm|aa|aaaa/gi, matched => map[matched])
}


const resizeAndDownload = () => {
  const canvas = document.createElement("canvas");
  const a = document.createElement("a");
  const ctx = canvas.getContext("2d");

  const imgQuality = qualityInput.checked ? 0.5 : 1.0;

  canvas.width = widthInput.value;
  canvas.height = heightInput.value;

  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

  // a.href = canvas.toDataURL("image/jpeg", imgQuality);
  a.href = canvas.toDataURL(imageType, imgQuality);
  a.download = nameTemp + '_' + formatDate(today, 'dd-mm-aa');
  a.click();
};


downloadButton.addEventListener("click", resizeAndDownload);

fileInput.addEventListener("change", loadFile);

fileBox.addEventListener("click", () => fileInput.click());
