// js/script.js

// Inicializa a biblioteca AOS (Animate On Scroll)
AOS.init({
    duration: 800,      // Duração da animação em milissegundos
    easing: 'ease-out', // Tipo de aceleração da animação
    once: true          // As animações só acontecem uma vez ao rolar para baixo
});

// Adiciona Rolagem Suave para Links Internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Impede o comportamento padrão do link (salto imediato)

        // Rola a página suavemente até a seção cujo ID corresponde ao 'href' do link
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- Adição para o status do servidor ---

// Função para buscar e exibir o status do servidor
async function fetchServerStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const playersOnline = document.getElementById('players-online');
    // MUITO IMPORTANTE: Substitua pela URL REAL da sua API de status do servidor.
    // Exemplo: 'https://api.meuservidor.com/status' ou '/api/status' se for no mesmo domínio
    const serverApiUrl = 'SUA_URL_DA_API_DE_STATUS_DO_SERVIDOR_AQUI'; 

    if (!statusIndicator || !playersOnline) {
        console.warn('Elementos de status do servidor (status-indicator ou players-online) não encontrados no HTML.');
        return;
    }

    statusIndicator.textContent = 'Verificando...';
    statusIndicator.style.color = '#FFA500'; // Cor laranja para "Verificando"
    playersOnline.textContent = ''; // Limpa a informação de jogadores enquanto verifica

    try {
        const response = await fetch(serverApiUrl); // Faz a requisição à API
        
        if (!response.ok) {
            // Se a resposta HTTP não for bem-sucedida (ex: 404, 500), considera offline ou erro
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const data = await response.json(); // Converte a resposta para JSON

        // Supondo que a API retorne um JSON com: { "online": true, "players": 15 }
        if (data.online) {
            statusIndicator.textContent = 'Online';
            statusIndicator.style.color = '#28a745'; // Cor verde para "Online"
            playersOnline.textContent = `Jogadores Online: ${data.players || 0}`;
        } else {
            statusIndicator.textContent = 'Offline';
            statusIndicator.style.color = '#dc3545'; // Cor vermelha para "Offline"
            playersOnline.textContent = ''; // Limpa jogadores se offline
        }

    } catch (error) {
        console.error('Erro ao buscar status do servidor:', error);
        statusIndicator.textContent = 'Indefinido';
        statusIndicator.style.color = '#6c757d'; // Cor cinza para erro
        playersOnline.textContent = '';
    }
}

// Chama a função fetchServerStatus quando a página é completamente carregada
document.addEventListener('DOMContentLoaded', fetchServerStatus);

// Opcional: Atualiza o status do servidor a cada X segundos (neste exemplo, a cada 30 segundos)
// Isso é bom para manter o status sempre atualizado sem precisar recarregar a página.
// Descomente a linha abaixo se quiser ativar a atualização automática.
// setInterval(fetchServerStatus, 30000); // 30000 ms = 30 segundos