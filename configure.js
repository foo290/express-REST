function apply_middlewares(app, middlewares){
    middlewares.forEach(element => {
        app.use(element)
    });
}


function configure_app(app, middlewares){
    apply_middlewares(app, middlewares)
}


module.exports = {
    configure_app,
    apply_middlewares
}
