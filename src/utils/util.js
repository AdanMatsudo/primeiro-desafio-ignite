export function validaCampos(title, description){
    if(!title || !description){
        return true
      }else{
        return
      }
}

export function dataAtual(){
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth() + 1; // Lembrando que os meses são indexados de 0 a 11
  const dia = dataAtual.getDate();

  return `${ano}-${mes}-${dia}`;
}