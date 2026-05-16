export interface Produtos{
    id:string,
    titulo:string,
    preco:number,
    imagem:string,
    descricao:string
}

export const produtos : Produtos[]=[
    {
        id:"prd10",
        titulo:"Notebook",
        preco:4990,
        imagem:"https://images.unsplash.com/photo-1727886184119-9dcbc3e0251f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        descricao: "O notebook Dell Inspiron 15 I15-I3100-A15P proporciona uma forma inteligente de aproveitar seu dia. Ele é tão elegante por fora quanto eficiente por dentro. Contando com processador Intel Core 3-100U, 8GB de memória RAM e 512GB de SSD, você pode concluir sua lista de tarefas num piscar de olhos. Conecte-se a tudo de que você gosta. Curta chats de vídeo de qualidade com uma webcam HD integrada que mostra você da melhor forma. Passe mais tempo diante da tela com o software Dell ComfortView, uma solução de software que ajuda a reduzir as emissões nocivas de luz azul para manter os olhos confortáveis durante longos tempos de visualização. A tela é de 15,6 com resolução Full HD (1920x1080) e o sistema operacional é o Windows 11 para uma experiência completa e Microsoft Office Trial – Versão para experimentação, válida por 30 dias"
    },
    {
        id:"prd11",
        titulo:"Relógio",
        preco:230,
        imagem:"https://images.unsplash.com/photo-1595923533867-ff8a01335ff9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        descricao:"Relógio Champion   Dourado Original Analógico A Prova Dágua CN26171W. Composição Do Vidro: Crystal Mineral, Material Da Caixa: Aço Inox, Cor Da Caixa: DOURADO, Material Da pulseira: Aço Inox"
    },
    {
        id:"prd12",
        titulo:"Celular",
        preco:1200,
        imagem:"https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGFwYXJlbGhvJTIwY2VsdWxhcnxlbnwwfHwwfHx8MA%3D%3D",
        descricao:"O Samsung Galaxy A07 é a escolha perfeita para quem busca performance, uma bateria incrível e câmeras de alta qualidade. Desenhado para o seu dia a dia, ele combina um design moderno com todos os recursos que você precisa para se conectar, criar e se divertir. Viva com mais liberdade e menos preocupação com a tomada. Com uma poderosa bateria de 5000mAh, o Galaxy A07 tem energia de sobra para um dia inteiro de uso intenso, seja para maratonar séries, jogar ou navegar nas redes sociais."
    }
]

 