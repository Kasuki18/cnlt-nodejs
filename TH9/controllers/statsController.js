const students = require('../data/students');

exports.getGeneralStats = (req, res) => {
    const active = students.filter(s => !s.isDeleted);
    const avgAge = active.reduce((sum, s) => sum + s.age, 0) / active.length || 0;
    res.json({
        total: students.length,
        active: active.length,
        deleted: students.filter(s => s.isDeleted).length,
        averageAge: Number(avgAge.toFixed(1))
    });
};

exports.getClassStats = (req, res) => {
    const stats = students.filter(s => !s.isDeleted).reduce((acc, s) => {
        acc[s.class] = (acc[s.class] || 0) + 1;
        return acc;
    }, {});
    res.json(Object.entries(stats).map(([cls, count]) => ({ class: cls, count })));
};