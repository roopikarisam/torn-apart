//import { bigMoneyFormat } from "../utils";
//import sideBarSpreadsheet from "./sidebar-spreadsheet";

import { bigMoneyFormat } from "../utils";
import sideBarSpreadsheet from "./sidebar-spreadsheet";
export default function(d){

  const html = [`<h3 style="color:#8da0cb;">${d.name}</h3>`];
  html.push(`<h4 style="color:#8da0cb;"><span data-i18n="ta-value-to-date"></span>:
      $${bigMoneyFormat(d.total_value)}</h4>`);
  html.push(sideBarSpreadsheet(d));
  return html.join("\n");

}
