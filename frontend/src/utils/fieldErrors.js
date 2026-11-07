// API 422 klaidas { title: ['...'] } paverčia į { title: '...' } – rodome pirmą kiekvieno lauko klaidą
export function fieldErrors(error) {
  return Object.fromEntries(Object.entries(error?.errors || {}).map(([field, messages]) => [field, messages[0]]));
}
