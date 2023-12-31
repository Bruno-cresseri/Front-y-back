const express = require('express')
const app = express()
const PORT = 3000;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const SECRET_KEY = "CLAVE?SECRETA";

app.use(cors());

// Middle que autoriza el carrito
const authorize = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, 'Frase?secreta?');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

function verificarToken(token) {
    try {
        // Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded);
        return decoded; // Retorna la información contenida en el token
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return null; // Retorna null si hay un error en la verificación
    }
}

verificarToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTcwMDk1NTMzM30.shA3dWtLdHUbxjd1-bZ9gvLjK6N09GZafdQQmFM0p_8");

app.use(express.json());
// Usar el middleware de autorización para la ruta /cart
app.use('/api/cart', authorize);

const baseDirectory = path.join(__dirname, 'bd');







////////// ACA COMIENZAN TODOS LOS ENDPOINTS ////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('<h1>Base de datos funcionando</h1>');
});

// Esto agarra los datos de cat.json
app.get('/api/cats/cat.json', (req, res) => {
    const catJsonPath = path.join(baseDirectory, 'cats', 'cat.json');
    res.sendFile(catJsonPath);
});

// Esto agarra los datos del buy.json
app.get('/api/cart/buy.json', (req, res) => {
    const buyJsonPath = path.join(baseDirectory, 'cart', 'buy.json');
    res.sendFile(buyJsonPath);
});

// Aca agarramos los cats_products por el id
app.get('/api/cats_products/:catID', (req, res) => {
    const catID = req.params.catID;
    const catProductsJsonPath = path.join(baseDirectory, 'cats_products', `${catID}.json`);
    res.sendFile(catProductsJsonPath);
});
// Aplica lo mismo para products y todos los json divididos en varios archivos
app.get('/api/products/:productID', (req, res) => {
    const productID = req.params.productID;
    const productJsonPath = path.join(baseDirectory, 'products', `${productID}.json`);
    res.sendFile(productJsonPath);
});

//Misma logica para comentarios
app.get('/api/products_comments/:productID', (req, res) => {
    const productID = req.params.productID;
    const productCommentsJsonPath = path.join(baseDirectory, 'products_comments', `${productID}.json`);
    res.sendFile(productCommentsJsonPath);
});

// Devuelve el json de sell
app.get('/api/sell/publish.json', (req, res) => {
    const publishJsonPath = path.join(baseDirectory, 'sell', 'publish.json');
    res.sendFile(publishJsonPath);
});


// Devuelve el userCart
app.get('/api/user_cart/:userID', (req, res) => {
    const userID = req.params.userID;
    const userCartJsonPath = path.join(baseDirectory, 'user_cart', `${userID}.json`);
    res.sendFile(userCartJsonPath);
});


/*
const users = [
    { id: 1, username: 'facundoDuque@gmail.com', password: '12345facu' },
    { id: 2, username: 'GonzaloMaulella@gmail.co', password: 'gonza12345' }
];
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin@admin.com" && password === "admin") {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});