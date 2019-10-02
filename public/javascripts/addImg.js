function addimage() {
    console.log("yup");
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        // getting a hold of the file reference
        var file = e.target.files[0];
        // setting up the reader
        var reader = new FileReader();
        reader.readAsDataURL(file); // this is reading as data url
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            var current = $('#images').val();
            $('#images').empty();
            $('#images').val(current + "|" + content); //add base64 string to 
        }
    }
    input.click();
}