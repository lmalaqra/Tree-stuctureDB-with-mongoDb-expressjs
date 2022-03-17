const { Topic, Question } = require("./model");
const mongoose = require("mongoose");

const updateName = async (id, contet) => {
  const topic = await Topic.findOneAndUpdate({ id }, { content });
};

const updateAncestorTopicsNames = async (preName, postName) => {
  try {
    const topic = await Topic.updateMany(
      { "ancestors.name": preName },
      { $set: { "ancestors.$.name": postName } }
    );
    return topic;
  } catch (e) {
    console.log(e);
  }
};

const buildAncestors = async (id, parent_id) => {
  let ancest = [];
  try {
    let parent_category = await Topic.findOne(
      { _id: parent_id },
      { name: 1, ancestors: 1 }
    ).exec();
    if (parent_category) {
      const { _id, name } = parent_category;
      const ancest = [...parent_category.ancestors];
      ancest.unshift({ _id, name });
      return await Topic.findByIdAndUpdate(id, {
        $set: { ancestors: ancest },
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const createFatherTopic = async (name) => {
  const topic = await Topic.findOne({ name });
  if (topic) return;

  return await Topic.create({ name });
};

const createSubTopic = async (fatherName, name) => {
  const fatherTopic = await Topic.findOne({ name: fatherName });
  const topic = await Topic.findOne({ name });
  if (topic) return;
  const newTopic = await Topic.create({ name });
  return await buildAncestors(newTopic._id, fatherTopic._id);
};
const findTopicByName = async (name) => {
  return await Topic.findOne({ name });
};
const createNewQuestion = async (number, topics) => {
  return await Question.create({ number, topics });
};

const getTopicsIdByName = async (name) => {
  const result = await Topic.find({
    $or: [{ name }, { "ancestors.name": name }],
  })
    .select({
      _id: true,
      name: false,
    })
    .exec();

  return result.map((e) => {
    return e._id;
  });
};

const getQuestionByIds = async (ids) => {
  console.log(ids);
  const questions = await Question.find({ topics: { $in: ids } })
    .select({
      number: true,
      _id: false,
    })
    .exec();
  return questions.map((e) => e.number);
};

const updateTopicNamebyName = async (prename, name) => {
  const updatedTopic = Topic.findOne({
    name: prename,
  }).then((doc) => {
    doc.name = name;
    doc.save((err) => {
      if (err) {
        return e;
      }
      return doc;
    });
    return doc;
  });
  return updatedTopic;
};
module.exports = {
  updateAncestorTopicsNames,
  createFatherTopic,
  createSubTopic,
  createNewQuestion,
  findTopicByName,
  getTopicsIdByName,
  getQuestionByIds,
  updateTopicNamebyName,
};
