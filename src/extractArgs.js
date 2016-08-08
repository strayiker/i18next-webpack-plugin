/**
 * Created by Kir on 06.08.2016.
 */

export default function extractArgs(arg) {
  switch (arg.type) {
    case 'Literal':
      return arg.value;
    case 'Identifier':
      return arg.name;
    case 'MemberExpression':
      return `${extractArgs(arg.object)}.${extractArgs(arg.property)}`;
    case 'ObjectExpression':
      {
        const res = {};
        for (const key of Object.keys(arg.properties)) {
          res[extractArgs(arg.properties[key].key)] =
            extractArgs(arg.properties[key].value);
        }
        return res;
      }
    default:
      throw new Error(`I18nextPlugin. Unable to parse arg ${arg}.`);
  }
}
