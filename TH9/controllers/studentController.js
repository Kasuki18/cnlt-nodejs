const students = require('../data/students');

exports.getAll = (req, res) => {
    let { name, class: cls, sort, page = 1, limit = 2 } = req.query;
    let result = students.filter(s => !s.isDeleted);

    if (name) result = result.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (cls) result = result.filter(s => s.class === cls);
    if (sort === 'age_desc') result.sort((a, b) => b.age - a.age);

    const total = result.length;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + parseInt(limit));

    res.json({ page: parseInt(page), limit: parseInt(limit), total, data });
};

exports.getById = (req, res) => {
    const student = students.find(s => s.id == req.params.id && !s.isDeleted);
    student ? res.json(student) : res.status(404).json({ message: "Không tìm thấy" });
};

exports.create = (req, res) => {
    const { name, email, age, class: cls } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) return res.status(400).json({ error: "Name ≥ 2 ký tự" });
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Email sai định dạng" });
    if (students.some(s => s.email === email)) return res.status(400).json({ error: "Email trùng" });
    if (age < 16 || age > 60) return res.status(400).json({ error: "Age 16-60" });

    const newS = { id: Date.now(), name, email, age, class: cls, isDeleted: false };
    students.push(newS);
    res.status(201).json(newS);
};

exports.update = (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id && !s.isDeleted);
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
    students[index] = { ...students[index], ...req.body };
    res.json(students[index]);
};

exports.softDelete = (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (student) {
        student.isDeleted = true;
        return res.json({ message: "Đã xóa mềm" });
    }
    res.status(404).json({ message: "Không tìm thấy" });
};