const filterPromiseArray = (promiseArray) => {
    return promiseArray
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
};

const filterBlankObject = (array) => {
    return array.filter((value) => !!value && !!Object.keys(value)?.length);
};

export { filterPromiseArray, filterBlankObject };
