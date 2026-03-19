const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

// ===== DATA =====
const items = [
{ id:1, name:'Hãy Trao Cho Anh', artist:'Sơn Tùng M-TP', date:'01/07/2019', hot:true, image:'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/15/13/cb/1513cb0b-c5a9-ac85-32ec-907ecfc98c8e/23UM1IM10668.rgb.jpg/1200x1200bf-60.jpg' },
{ id:2, name:'Chúng Ta Của Hiện Tại', artist:'Sơn Tùng M-TP', date:'20/12/2020', hot:true, image:'https://i.scdn.co/image/ab67616d0000b2732cd9649ea111a552283f0165' },
{ id:3, name:'Em Gái Mưa', artist:'Hương Tràm', date:'04/09/2017', hot:true, image:'https://i.ytimg.com/vi/Y29OrOVJUKs/maxresdefault.jpg' },
{ id:4, name:'Bước Qua Nhau', artist:'Vũ.', date:'15/03/2021', hot:false, image:'https://i.ytimg.com/vi/5CssmMlXOPA/maxresdefault.jpg' },
{ id:5, name:'Có Chàng Trai Viết Lên Cây', artist:'Phan Mạnh Quỳnh', date:'10/02/2020', hot:true, image:'https://i.ytimg.com/vi/9edzM5PaMi4/maxresdefault.jpg' },
{ id:6, name:'Nàng Thơ', artist:'Hoàng Dũng', date:'20/10/2020', hot:false, image:'https://images.genius.com/33e97cd93834978191b2e1e792c37e27.1000x1000x1.jpg' },
{ id:7, name:'Tháng Tư Là Lời Nói Dối', artist:'Hà Anh Tuấn', date:'01/04/2016', hot:true, image:'https://th.bing.com/th/id/OIP.yWSbsHGx37Z-M4BOS4jqjwHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' },
{ id:8, name:'Đi Đu Đưa Đi', artist:'Bích Phương', date:'28/08/2019', hot:false, image:'https://tse4.mm.bing.net/th/id/OIP.kLbrhyvG988NviM5gctjygHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
{ id:9, name:'See Tình', artist:'Hoàng Thùy Linh', date:'24/02/2022', hot:true, image:'https://cdn.baoquocte.vn/stores/news_dataimages/2023/042023/12/12/giai-ma-con-sot-see-tinh-cua-hoang-thuy-linh-tai-han-quoc-20230412121203.jpg?rt=20230412121216' },
{ id:10, name:'Ghé Qua', artist:'Dick x Tofu x PC', date:'15/08/2021', hot:true, image:'https://i.ytimg.com/vi/zEWSSod0zTY/maxresdefault.jpg' }
];
// ===== ROUTES =====
app.get('/', (req, res) => {
    res.render('index', { title: 'Trang chủ' });
});

app.get('/list', (req, res) => {
    res.render('list', {
        title: 'Top bài hát Việt Nam',
        items: items
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Liên hệ' });
});

app.get('/detail/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(x => x.id === id);

    if (!item) return res.send('Không tìm thấy');

    res.render('detail', {
        title: 'Chi tiết bài hát',
        item: item
    });
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});