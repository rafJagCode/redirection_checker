import fs from "fs";
import { parse } from "csv-parse";
import { checkRedirection } from "./checkRedirection.js";

const linkMap = new Map();

fs.createReadStream("./links-in.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (row) => {
    const link = row[0];
    linkMap.set(link, null);
  })
  .on("end", async () => {
    for (const [link, _] of linkMap) {
      const redirectTo = await checkRedirection(link);
      linkMap.set(link, redirectTo);
    }
    const output = fs.createWriteStream("./links-out.csv");
    output.write("LINKS OUT\n");
    for (const [_, redirectedTo] of linkMap) output.write(`${redirectedTo}\n`);
  });
