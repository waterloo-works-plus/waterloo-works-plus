export class TermUtil {

  static getCurrentJobSearchTerm = () => {
    const now = new Date();
    const term = 411 + 3 * (now.getFullYear() - 2018) + Math.floor((now.getMonth()) / 4);
    return term.toString();
  }

  static getCurrentWorkTerm = () => {
    const now = new Date();
    const term = 410 + 3 * (now.getFullYear() - 2018) + Math.floor((now.getMonth()) / 4);
    return term.toString();
  }

  static convertReadableTermToTermNum = (strTerm) => {
    const strTermSplit = strTerm.split(' - ');
    let termNum = 410;
    termNum += (parseInt(strTermSplit[0]) - 2018) * 3;
    
    if (strTermSplit[1] === 'Spring') {
      termNum++;
    } else if (strTermSplit[1] === 'Fall') {
      termNum += 2;
    }
  
    return termNum.toString();
  }

}