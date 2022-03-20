const {
  createFatherTopic,
  createSubTopic,
  findTopicByName,
  createNewQuestion,
  getTopicsIdByName,
  getQuestionByTopicIds,
  updateTopicNamebyName,
  createNewOneQuestion,
  getOneQueryQuestionNumbers,
} = require("./services");

const createTopicsDb = async (arr) => {
  const topics = [];
  const parsedArray = csvToArray(arr);
  for (let i = 0; i < parsedArray.length; i++) {
    if (i === 0) continue;
    const topic = await handleTopicRows(parsedArray[i]);
    topics.push(topic);
  }
  return topics;
};

const handleTopicRows = async (arr) => {
  const topics = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isBlank) continue;
    if (i === 0) {
      const topic = await createFatherTopic(arr[i]);
      topics.push(topic);
    } else {
      const topic = await createSubTopic(arr[i - 1], arr[i]);
      topics.push(topic);
    }
  }
  return topics;
};

// convert cvs to arrays
function csvToArray(text) {
  let p = "",
    row = [""],
    ret = [row],
    i = 0,
    r = 0,
    s = !0,
    l;
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      if ("\r" === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}

const createQuestionDb = async (arr, value) => {
  const topics = [];
  const parsedArray = csvToArray(arr);
  for (let i = 0; i < parsedArray.length; i++) {
    if (i === 0) continue;
    const topic = await handleQuestionsRows(parsedArray[i], value);
    topics.push(topic);
  }
  return topics;
};

const handleQuestionsRows = async (arr, value) => {
  const questions = [];
  let number;
  const topics = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isBlank || arr[i] === "") continue;
    if (i === 0) {
      number = parseInt(arr[i]);
      if (!number) break;
    } else {
      const topic = await findTopicByName(arr[i]);
      if (!topic) return;
      topics.push(topic._id);
    }
  }
  if (!number) return;

  const question = await createNewQuestion(number, topics);

  return questions;
};

const getQuestions = async (name) => {
  const ids = await getTopicsIdByName(name);
  const questions = await getQuestionByTopicIds(ids);
  return questions;
};
const updateTopicNamebyNameHandler = async (name) => {
  return await updateTopicNamebyName(name);
};

module.exports = {
  createTopicsDb,
  createQuestionDb,
  getQuestions,
  updateTopicNamebyNameHandler,
};
