const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // Ou qualquer porta que voc锚 preferir

// Middleware para lidar com dados JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos est谩ticos (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint para adicionar um link ao hist贸rico
app.post('/add-to-history', (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).json({ error: 'Link 茅 obrigat贸rio' });
    }

    const filePath = path.join(__dirname, 'public', 'txt.txt');
    fs.appendFile(filePath, `${link}\n`, err => {
        if (err) {
            return res.status(500).json({ error: 'Falha ao salvar o hist贸rico' });
        }
        res.status(200).json({ message: 'Link adicionado ao hist贸rico' });
    });
});

// Endpoint para obter o hist贸rico
app.get('/history', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'txt.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Falha ao ler o hist贸rico' });
        }
        const links = data.split('\n').filter(Boolean);
        res.json({ history: links });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
