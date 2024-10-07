import fs from "fs";
import { parse } from "csv-parse";
import { checkRedirection } from "./checkRedirection.js";

const linkMap = new Map();
const promises = [];

fs.createReadStream("./links-in.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (row) => {
    const link = row[0];
    linkMap.set(link, null);
    const promise = checkRedirection(link).then((redirectedTo) => {
      linkMap.set(link, redirectedTo);
    });
    promises.push(promise);
  })
  .on("end", () => {
    Promise.all(promises).then(() => {
      const output = fs.createWriteStream("./links-out.csv");
      output.write("LINKS OUT\n");
      for (const [_, redirectedTo] of linkMap)
        output.write(`${redirectedTo}\n`);
    });
  });
