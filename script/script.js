"use strict";
//dayJS plugins
dayjs.extend(preciseDiff);
dayjs.extend(window.dayjs_plugin_customParseFormat);
//limit the character count for input type "number"
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.oninput = () => {
    if (input.value.length > input.maxLength)
      input.value = input.value.slice(0, input.maxLength);
  };
});

//fill the birthday object with input values
document.querySelector(".inputArea").addEventListener("input", setValue);
function setValue(e) {
  birthday[e.target.name] = e.target.valueAsNumber; //value is a string
}

//birthday object, property value type "number"
let birthday = {
  year: 0,
  month: 0,
  day: 0,
};

const currentDate = dayjs();

//VALIDATORS
const required = (val) => {
  if (!val) {
    return "This field is required.";
  }
};

//day, month, year validator
const isBetweenRange = (min, max) => (val) => {
  if (val < min) {
    console.log(typeof val); //temp check
    console.log(typeof min); //temp check
    return `Value should be at least ${min}.`;
  }

  if (val > max) {
    return `Value should be at most ${max}.`;
  }

  return null;
};
//NEW
const characterValidator = (lngth, selector, val) => {
  let valStr = val.toString();
  while (valStr.length < lngth) {
    valStr = "0" + valStr;
    document.querySelector(`#${selector}`).value = valStr;
  }
  return valStr;
};

//birthday date validator
const isValidDate = (val) => {
  if (!val.isValid()) {
    return "Must be a valid date.";
  }

  return null;
};

//birthday date validator
const isBeforeDate = (val) => {
  if (!dayjs(val).isBefore(currentDate)) {
    return "Birthday date must be in the past.";
  }

  return null;
};

const validate = (val, validators) =>
  validators.reduce((errors, currentValidator) => {
    const validationResult = currentValidator(val);
    if (validationResult) {
      return [...errors, validationResult];
    }

    return errors;
  }, []);

const yearValidators = [required, isBetweenRange(1900, 2023)];
const monthValidators = [required, isBetweenRange(1, 12)];
const dayValidators = [required, isBetweenRange(1, 31)];

//check after the onclick event
document.querySelector(".image").addEventListener("click", () => {
  //NEW
  let birthdayString = {
    year: "",
    month: "",
    day: "",
  };

  //NEW
  birthdayString.day = characterValidator(2, "day", birthday.day); //days
  birthdayString.month = characterValidator(2, "month", birthday.month); //months
  birthdayString.year = characterValidator(4, "year", birthday.year); //years

  //NEW
  let birthdayDate = dayjs(
    `${birthdayString.year}-${birthdayString.month}-${birthdayString.day}`,
    "YYYY-MM-DD",
    true
  );

  console.log(birthdayDate);
  //initial validators
  const yearErrors = validate(birthday.year, yearValidators);
  const monthErrors = validate(birthday.month, monthValidators);
  const dayErrors = validate(birthday.day, dayValidators);
  //display single error only
  document.querySelector(".yearInput > .error").textContent = yearErrors[0];
  document.querySelector(".monthInput > .error").textContent = monthErrors[0];
  document.querySelector(".dayInput > .error").textContent = dayErrors[0];
  //reset the previous date
  document.querySelector(".yearResult").innerHTML = "--";
  document.querySelector(".monthResult").innerHTML = "--";
  document.querySelector(".dayResult").innerHTML = "--";
  //if numbers are ok validate whole date
  if (
    yearErrors.length === 0 &&
    monthErrors.length === 0 &&
    dayErrors.length === 0
  ) {
    const dateValidators = [isValidDate, isBeforeDate];
    const dateErrors = validate(birthdayDate, dateValidators);
    document.querySelector(".dayInput > .error").textContent = dateErrors[0];
    //if whole date is valid then calculate the result
    if (dateErrors.length === 0) {
      let diff = dayjs.preciseDiff(birthdayDate, currentDate, true);
      document.querySelector(".yearResult").innerHTML = diff.years;
      document.querySelector(".monthResult").innerHTML = diff.months;
      document.querySelector(".dayResult").innerHTML = diff.days;
    }
  }
});
