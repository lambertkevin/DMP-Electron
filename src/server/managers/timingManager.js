import path from 'path';
import xlsx from 'xlsx';
import moment from 'moment';
import mkdirp from 'mkdirp';
import { timingColumnOrder, timingPath, musicDir } from '../config';

export default {

  createFolders() {
    const jsonTiming = this.getXlsxAsJson(timingPath);
    const parsedTiming = this.getParsedTiming(jsonTiming);

    parsedTiming.forEach((row) => {
      if (row && this.getFolderName(row)) {
        const folderName = this.getFolderName(row).replace(/\//g, '|');
        mkdirp.sync(path.join(musicDir, folderName));
      }
    });

    return parsedTiming;
  },

  getXlsxAsJson(filePath) {
    const rawFile = xlsx.readFile(filePath);
    const firstSheetName = rawFile.SheetNames[0];

    return xlsx.utils.sheet_to_json(rawFile.Sheets[firstSheetName], { header: 1 });
  },

  getParsedTiming(jsonTiming) {
    return jsonTiming.map((row) => {
      const timingColumnOderNames = Object.keys(timingColumnOrder);
      const rowWithNames = {};

      timingColumnOderNames.forEach((timingColumnOrderName) => {
        rowWithNames[timingColumnOrderName] = row[timingColumnOrder[timingColumnOrderName]];
      });

      return rowWithNames;
    });
  },

  getFolderName(parsedTimingRow) {
    const rowEntries = Object.entries(parsedTimingRow);

    const nameArray = rowEntries.map(([rowName, rowValue]) => {
      if (!rowValue) {
        return false;
      }

      switch (rowName) {
        case 'time': {
          const time = moment(rowValue, 'hh:mm:ss');
          return time.isValid() ? time.format('HH[h]mm') : false;
        }
        case 'category': {
          return rowValue.replace(/[\s]?[/][\s]?/g, ' & ');
        }
        case 'heats': {
          return `${rowValue}H`;
        }
        case 'round': {
          const lcRound = rowValue.toLowerCase();

          if (lcRound === 'final' || lcRound === 'finale') {
            return 'F';
          }
          return rowValue;
        }
        case 'type': {
          const latinRegex = /(^lat)/i;
          const standardRegex = /(^st).*[d]/i;

          if (latinRegex.test(rowValue)) {
            return 'lat';
          } else if (standardRegex.test(rowValue)) {
            return 'std';
          }
          return false;
        }
        default:
          return false;
      }
    });

    return nameArray.reduce((oldString, newString) => {
      if (newString) {
        return `${oldString} - ${newString}`;
      }

      return false;
    });
  }
};

