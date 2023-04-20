export const getSession = (req, res) => {
    if(req.session.login) {
        res.redirect('/product', {
            'message': "Bienvenido a la tienda"
        })
    }
    //
       
}