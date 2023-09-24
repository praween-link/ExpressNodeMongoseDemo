var menu = document.getElementById('menu');

var show = 1;

function menuAction(){
    console.log(`Clicked - ${show}`);
    if(show == 1){
        menu.style.display = 'block';
        show = 0;
    }else{
        menu.style.display = 'none';
        show = 1;
    }
}

function checker(){
    if(window.confirm("Are you sure")){
      document.getElementById("deleteCustomer").submit();
    } else {
      return;
    }
  }