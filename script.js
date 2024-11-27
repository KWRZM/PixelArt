const imgInput = document.getElementById('import');
const importButton = document.getElementById('impBut');
let textImg = "";
let tempArray = new Array;
let bytesArray,height,width,padding,firstPic = false,repense,convertis;

document.querySelector('.button-64').addEventListener('click',function(e){
    imgInput.click();
});

imgInput.addEventListener('change',async (e) => {
    if(e == null)return;

    const file = imgInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const image = new Image();
        image.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = image.width;
          canvas.height = image.height;
          
          if(image.width > 1600)canvas.width = 1600;
          if(image.height > 1400)canvas.height = 1400;
          
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);

          ctx.drawImage(image, 0, 0,canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          Jimp.create(imageData.width, imageData.height, function(err, bmp) {
            bmp.bitmap.data = imageData.data;
            bmp.getBuffer(Jimp.MIME_BMP, function(err, buffer) {
              let binary = '';
              const bytes = new Uint8Array(buffer);
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const convertedData = 'data:image/bmp;base64,' + btoa(binary);
              convertis = convertedData;
              
              /*const downloadLink = document.createElement('a');
              downloadLink.href = convertedData;
              downloadLink.download = 'myImage.bmp';
              downloadLink.click();*/

            });
          });
        }
        image.src = event.target.result;
      }
      reader.readAsDataURL(file);
    }
    
    setTimeout(function() {

        const buffer = Buffer.from(convertis.replace(/^data:image\/\w+;base64,/, ""), "base64");
        bytesArray = new Uint8Array(buffer);
        width = parseInt(bytesArray[21].toString(16).padStart(2,"0") + bytesArray[20].toString(16).padStart(2,"0") + bytesArray[19].toString(16).padStart(2,"0") + bytesArray[18].toString(16).padStart(2,"0"),16);
        //height = parseInt(bytesArray[25].toString(16).padStart(2,"0") + bytesArray[24].toString(16).padStart(2,"0") + bytesArray[23].toString(16).padStart(2,"0") + bytesArray[22].toString(16).padStart(2,"0"),16);
        
        const fileSize = bytesArray[2] + (bytesArray[3] << 8) + (bytesArray[4] << 16) + (bytesArray[5] << 24);
        const bytesPerLine = Math.ceil((width * 24) / 8);
        height = Math.abs(fileSize - bytesArray[10]) / bytesPerLine;
        height = Math.round(height)-1;
        
        if(height > 2000 || width > 2000){console.log("ERROR: Size of picture is too big.");return;}

        if(firstPic == false){
            importButton.removeChild(importButton.children[0]);
            importButton.classList.remove('button-64');
            importButton.classList.add('button-36');
            importButton.textContent = "Import Again";
            importButton.style.color = "white";
        }

        document.body.style.backgroundImage = "none";
        document.getElementById('cadreBord').style.display = "block";
        importButton.style.fontSize = "18px";
    
        imgInput.style.outline = 0;


        rapport = 3.6-Math.sqrt(height * width) / 250;
        if(rapport < 1)rapport = 1;
        if(height >= 1000 || width >= 1000)rapport = 0.8;
    
        padding = (4 - (width * 24 / 8) % 4) % 4;
    
        console.log(`width = ${width} height = ${height} padding = ${padding} rapport = ${rapport}`);
    
        if(document.getElementById('cadre') == null){
            const cadre = document.createElement('pre');
            cadre.id = "cadre";
            document.getElementById('cadreBord').appendChild(cadre);
        }
        
        const cadreB = document.getElementById('cadre');
        cadreB.style.fontSize = `${rapport}px`;
        pixelize();
        
        
        if(firstPic == false){
            document.getElementById('cadreBord').addEventListener("click", function() {
            const texte = this.innerText;
            navigator.clipboard.writeText(texte)
            .then(() => {
              console.log(`Le texte a été copié dans le presse-papier`);
            })
            .catch(err => {
              console.error('Impossible de copier le texte: ', err);
            });
            });
        }
        firstPic = true;
      }, 500);
});



function chargerFichierTexte() {
    fetch('Converted.txt')
      .then(response => response.text())
      .then(text => {
        document.getElementById('cadre').textContent = text;
        textImg = text;
    });
}

function GreyScale_Conversion(Pixel,Theme){

    if(Theme == 0){
        Pixel=255-Pixel;
    }

    if(Pixel < 6){Pixel='$';}
    else if(Pixel < 14  ){Pixel='@';}
    else if(Pixel < 21  ){Pixel='%';}
    else if(Pixel < 28  ){Pixel='B';}
    else if(Pixel < 35  ){Pixel='8';}
    else if(Pixel < 42  ){Pixel='&';}
    else if(Pixel < 49  ){Pixel='W';}
    else if(Pixel < 56  ){Pixel='M';}
    else if(Pixel < 63  ){Pixel='#';}
    else if(Pixel < 70 ){Pixel='m';}
    else if(Pixel < 77 ){Pixel='Z';}
    else if(Pixel < 84 ){Pixel='O';}
    else if(Pixel < 98 ){Pixel='0';}
    else if(Pixel < 105 ){Pixel='L';}
    else if(Pixel < 112 ){Pixel='C';}
    else if(Pixel < 119 ){Pixel='J';}
    else if(Pixel < 126 ){Pixel='U';}
    else if(Pixel < 133 ){Pixel='Y';}
    else if(Pixel < 140 ){Pixel='X';}
    else if(Pixel < 147 ){Pixel='z';}
    else if(Pixel < 154 ){Pixel='c';}
    else if(Pixel < 161 ){Pixel='v';}
    else if(Pixel < 168 ){Pixel='?';}
    else if(Pixel < 175 ){Pixel='+';}
    else if(Pixel < 182 ){Pixel='-';}
    else if(Pixel < 189 ){Pixel='~';}
    else if(Pixel < 196 ){Pixel='i';}
    else if(Pixel < 203 ){Pixel='!';}
    else if(Pixel < 210 ){Pixel=';';}
    else if(Pixel < 217 ){Pixel=':';}
    else if(Pixel < 224 ){Pixel=',';}
    else if(Pixel < 231 ){Pixel='"';}
    else if(Pixel < 238 ){Pixel='^';}
    else if(Pixel < 245 ){Pixel="'";}
    else if(Pixel < 252 ){Pixel='.';}
    else if(Pixel <= 255){Pixel=' ';}

    return Pixel;
}

function rgb2GrayScale(R,G,B){
    return (0.3*R+0.59*G+0.11*B);
}

function pixelize(){
    let imgMatrix = [];
    let k = bytesArray[10];

    for(let i=height-1; i >= 0; i--){
        imgMatrix[i] = [];
        for(let j=0; j < width; j++){
            imgMatrix[i][j] = GreyScale_Conversion(rgb2GrayScale(bytesArray[k+2],bytesArray[k+1],bytesArray[k]),1);
            k+=3;
        }
        k+=padding;
    }
    let imageStr = "";
    for(let i=0; i < height ; i++){
        for(let j=0; j < width; j++){
            imageStr += imgMatrix[i][j];
            imageStr += imgMatrix[i][j];
        }
        imageStr += "\n";
    }
    document.getElementById('cadre').textContent = imageStr;

}

