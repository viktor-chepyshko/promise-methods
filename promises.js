const promiseExamples = async (method) => {
  clearResult(method);

  addTitle('ALL ARE SUCCESSFUL');

  const allSuccessful = await Promise[method]([
    getSuccessfulPromise(500, 1),
    getSuccessfulPromise(1000, 2),
    getSuccessfulPromise(1500, 3),
  ]);

  resultMapper(formatData(allSuccessful, method));

  addTitle('FIRST IS FAILED');

  try {
    const secondIsFailed = await Promise[method]([
      getFailedPromise(500, 1),
      getSuccessfulPromise(1000, 2),
      getSuccessfulPromise(1500, 3),
    ]);

    resultMapper(formatData(secondIsFailed, method));
  } catch (e) {
    const group = createGroup();
    addCard(e, group, 'error');
  }

  addTitle('ALL ARE FAILED');

  try {
    const allFailed = await Promise[method]([
      getFailedPromise(500, 1),
      getFailedPromise(1000, 2),
      getFailedPromise(1500, 3),
    ]);

    resultMapper(formatData(allFailed, method));
  } catch (e) {
    if (method === 'any') {
      console.log(
        `WHEN ALL PROMISES WERE REJECTED, THE ERROR WILL BE IN A SPECIAL OBJECT: ${e.constructor.name}.
        TO VIEW ALL ERRORS, REFER TO THE ERRORS PROPERTY: e.errors`
      );
      console.table(e.errors);
    }

    const group = createGroup();
    addCard(e, group, 'error');
  }
};

const formatData = (data, method) => {
  switch (method) {
    case 'all': {
      console.log(data);
      return data;
    }
    case 'allSettled': {
      console.log(data);
      return data.map(
        (data) => data.value ?? { status: 404, message: data.reason }
      );
    }
    case 'race': {
      console.log(data);
      return [data];
    }
    case 'any': {
      console.log(data);
      return [data];
    }
  }
};

const getFailedPromise = async (timeout, index) => {
  return await new Promise((_, rej) => {
    setTimeout(() => rej(new Error(`ERROR, FAIL - ${index}`)), timeout);
  });
};

const getSuccessfulPromise = async (timeout, index) => {
  return await new Promise((res) => {
    setTimeout(
      () => res({ status: 200, message: `SUCCESS - ${index}` }),
      timeout
    );
  });
};

const resultEl = document.getElementById('result');

const clearResult = (method) => {
  resultEl.innerHTML = '';
  console.clear();
  console.log(`PROMISE.${method}`);
};

const addTitle = (message) => {
  const child = document.createElement('h3');
  child.textContent = message;
  resultEl.appendChild(child);
};

const addCard = (message, group, type) => {
  const child = document.createElement('div');
  child.setAttribute('class', `card card_${type}`);
  child.textContent = message;
  group.appendChild(child);
};

const createGroup = () => {
  const group = document.createElement('div');
  group.setAttribute('class', 'card__group');
  resultEl.appendChild(group);

  return group;
};

const resultMapper = (arr) => {
  const group = createGroup();

  arr.forEach(({ status, message }) => {
    addCard(message, group, status === 200 ? 'success' : 'error');
  });
};
