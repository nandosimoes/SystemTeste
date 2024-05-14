document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'http://10.92.198.38:8080';

    async function postData(url, formData, token) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        return response.json();
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);

            try {
                const response = await postData(`${baseUrl}/auth/signup`, formData);
                console.log(response);

                if (response.success) {
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Erro ao cadastrar. Por favor, tente novamente.');
            }
        });
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            try {
                const response = await postData(`${baseUrl}/auth/signin`, formData);
                console.log(response);

                if (response.token) {
                    localStorage.setItem('token', response.token);
                    alert('Login realizado com sucesso!');
                    window.location.href = 'post.html';
                } else {
                    alert('Erro ao fazer login. Verifique suas credenciais.');
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Por favor, tente novamente.');
            }
        });
    }

    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;   
            const content = document.getElementById('content').value;
            const image = document.getElementById('image').files[0];

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Por favor, faça login para criar um post.');
                window.location.href = 'login.html';
                return;
            }

            if (title.length < 5) {
                alert('O título precisa ter pelo menos 5 caracteres!');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', image);

            try {
                const response = await postData(`${baseUrl}/feed/post`, formData, token);
                console.log(response);
            } catch (error) {
                console.error('Erro ao criar post:', error);
                alert('Erro ao criar post. Por favor, tente novamente.');
            }
        });
    }
});