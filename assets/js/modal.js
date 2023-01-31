//Function to display message in modal window

export default function showModal(messaage) {
  const modal = `
  <div id='modal'>
  <div id='modalInner' class='modal-inner'>
  ${messaage}
  <div class='close-icon'>X</div>
  </div>
  </div>`

  $('body').append(modal);

  $('#modal').on('click', function (e) {
    //If clicked on modalInner ignore, otherwise close modal
    if ($(e.target).attr('id') !== 'modalInner') {
      $('#modal').remove()
    }
  })

  document.body.addEventListener('keypress', removeModal);

  //Also remove modal on if user press any key
  function removeModal() {
    $('#modal').remove();
    document.body.removeEventListener('keypress', removeModal);
  }
}