let testArr = [1,1, 2,2, 3,3, 4,4, 5,5, 6,6, 7,7, 8,8]


function randomInt(min, max) {
  // min = Math.ceil(min);
  // max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

// for (let i = testArr.length; i > 0; i--) {
//   let randomNum = randomInt(0, i);
//   let drawnNum = testArr.splice(randomNum, 1);
//   testArr.push(drawnNum);
// }

let tdList = $('td');

// sets i to length of TDs
let i = tdList.length;
console.log(tdList.length)

tdList.each(function () {
  console.log("starting arr = " + testArr)
  let randomNum = randomInt(0, i);
  console.log("index = " + randomNum)
  let drawnNum = testArr.splice(randomNum, 1);
  console.log("drawn num = " + drawnNum)
  testArr.push(drawnNum);
  console.log("New array = " + testArr)
  $( this ).html(drawnNum)

  i--;
})
