## Protótipo Previsão do Tempo

Desafio Front-End

Objetivo

Construir uma página WEB para consulta de previsão do tempo, atendo os requisitos abaixo.

Eu como usuário...
Gostaria de escolher a cidade e visualizar a previsão do dia e da semana atual.
Gostaria de visualizar a temperatura máxima e mínima da semana;
Gostaria de saber o que fazer, se o tempo estiver bom ou ruim, especialmente no final de semana;
Gostaria de visualizar um gráfico demonstrando a evolução/variação da temperatura durante a semana;

Desenvolvimento

Utilizar uma API que retorne os dados para o desenvolvimento dos itens acima.

Ao acessar a página devem ser exibidas as informações:

Clima de Blumenau;
Possibilidade de alterar o Estado (combo) e a cidade (autocomplete);
Possibilidade de definir o local escolhido como favorito; (Ao recarregar a; página, as informações do local favoritado devem ser exibidas);

Fica a seu critério:

A construção da interface;
A utilização de uma paleta de cor;
Forma de armazenamento local dos dados; (Não deverá existir um servidor de aplicação, nem outra linguagem de programação e nem banco de dados)

Tecnologias:

AngularJS1 ou AngularJS 2 (se julgar necessário);
CSS3 (SASS ou LESS);
jQuery (se julgar necessário);
Esta página será exibida em um PC (22’ FullHD), em um tablet (10’ HD) e em um celular (5’ FullHD);
HTML5 e CSS3 deve ser utilizado ao máximo;


O que será avaliado?

Página funcionando;
Qualidade do código;
Usabilidade e Experiência de uso da página;
Uso de bibliotecas;
Cross-browser: IE10+, Chrome e Mozilla;
Responsivo;

## Considerações

Realizada a implementação desta página HTML acessando as APIs de localidades do IBGE e de clima do ClimaTempo. A página é responsiva sendo testada em chrome em desktop e IPhone 7. Tive dificuldades em encontrar uma API de clima que seja gratuita e traga as informações solicitadas no teste como estado, nem todas as APIs internacionais possuem e boa parte delas é paga. De API brasileira foi encontrada a ClimaTempo porém esta não funciona com páginas HTML onde o host da máquina é localhost, sendo que o filtro CORS do servidor do ClimaTempo ou não está configurado ou está configurado para não receber requests GET de servidores deste tipo. Enfim, para funcionar foi necessário instalar um plugin no Chrome chamado <b>Allow-Control-Allow-Origin: *</b> para realizar estas requisições.

Mais informações sobre as APIs em:
https://servicodados.ibge.gov.br/api/docs/localidades
http://apiadvisor.climatempo.com.br/doc/index.html


