module.exports.postAdd = (req, res) => {
  const {title} = req.body;
  const {dueDate} = req.body;
  const  {description} = req.body;

  res.send({title: title, dueDate: dueDate, description: description});
};