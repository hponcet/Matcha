const photoService = () => {
  var reader = new FileReader;
  reader.onload = function(event) {
      var img = new Image()
      if (file.type.match('image.*')) {
        console.log("is an image")
        console.log("Show type of image: ", file.type.split("/")[1])
      }
      img.src = event.target.result
      reader.readAsDataURL(this.files[0])
  }
}
