const deleteProduct = (btn) => {
    console.log('Clicked');
    const prodId = btn.parentNode.querySelector('[name=productId]');
    const csrf = btn.parentNode.querySelector('[name=_csrf]');

}