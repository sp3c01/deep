document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category');

    categories.forEach(category => {
        category.addEventListener('click', (event) => {
            if (event.target.closest('.favorite-btn')) return;

            const list = category.querySelector('ul');
            if (list.style.display === 'block') {
                list.style.display = 'none';
                list.style.maxHeight = null;
            } else {
                list.style.display = 'block';
                list.style.maxHeight = list.scrollHeight + 'px';
            }
        });
    });

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const text = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(text).then(() => {
                showMessage('Link copiado!');
                addToHistory(text);
            }).catch(err => {
                console.error('Falha ao copiar o link: ', err);
            });
        });
    });

    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const link = button.getAttribute('data-link');
            toggleFavorite(link, button);
        });
    });

    function showMessage(message) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');

        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 2000);
    }

    function addToHistory(link) {
        fetch('/add-to-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(data.message);
                loadHistory(); // Atualizar a lista de histórico após adicionar
            } else if (data.error) {
                console.error(data.error);
            }
        })
        .catch(err => {
            console.error('Erro ao adicionar ao histórico: ', err);
        });
    }

    function toggleFavorite(link, button) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(link)) {
            favorites = favorites.filter(fav => fav !== link);
            button.classList.remove('favorited');
        } else {
            favorites.push(link);
            button.classList.add('favorited');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function loadHistory() {
        fetch('/history')
            .then(response => response.json())
            .then(data => {
                if (data.history) {
                    const historyList = document.getElementById('history-list');
                    historyList.innerHTML = ''; // Limpar a lista atual
                    data.history.forEach(link => {
                        const listItem = document.createElement('li');
                        const linkElement = document.createElement('a');
                        linkElement.href = link;
                        linkElement.textContent = link;
                        linkElement.target = '_blank';
                        listItem.appendChild(linkElement);
                        historyList.appendChild(listItem);
                    });
                } else if (data.error) {
                    console.error(data.error);
                }
            })
            .catch(err => {
                console.error('Erro ao carregar o histórico: ', err);
            });
    }

    // Carregar histórico e favoritos ao inicializar
    loadHistory();
    loadFavorites();
});