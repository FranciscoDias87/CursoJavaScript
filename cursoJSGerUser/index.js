var fields = document.querySelectorAll('#form-user-create [name]');
var user = {};

//adicionando evento de click ao form 
document.getElementById('form-user-create').addEventListener("submit", function (event) {
  //prevenindo comportamento padrão
  event.preventDefault();

  fields.forEach(function (field, index) {
    if (field.name === 'gender') {
      if (field.checked)
        user[field.name] = field.value;

    } else {
      user[field.name] = field.value;
    }

  });

  console.log(user);

});
