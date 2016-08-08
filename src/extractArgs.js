/**
 * Created by Kir on 06.08.2016.
 */


export default function extractArgs(arg, q, wrap) {
  switch (arg.type) {
    case 'Literal':
      return arg.value;
    case 'Identifier':
      if (wrap) {
        return `${q}+${arg.name}+${q}`;
      }
      return arg.name;
    case 'BinaryExpression':
      return extractArgs(arg.left, q, true) + extractArgs(arg.right, q, true);
    case 'ObjectExpression': {
      const res = {};
      for (const i of arg.properties) {
        const key = extractArgs(arg.properties[i].key, q);
        res[key] = extractArgs(arg.properties[i].value, q, true);
      }
      return res;
    }
    default: {
      this.state.module.errors.push(new Error(
        `I18nextPlugin. Unable to parse arg ${arg}.`
      ));
      return '';
    }
  }
}
