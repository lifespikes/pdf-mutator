/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

const fetchStdin = async () => {
  const {stdin} = process;

  let result = '';

  if (stdin.isTTY) {
    return result;
  }

  stdin.setEncoding('utf8');

  for await (const chunk of stdin) {
    result += chunk;
  }

  return result;
};

const getStdin = () =>
  new Promise<string>(resolve => {
    fetchStdin().then(out => {
      if (!out.length) {
        const i = setInterval(async () => {
          const output = await fetchStdin();

          if (output.length > 0) {
            clearInterval(i);
            resolve(output);
          }
        }, 500);

        setTimeout(() => {
          if (i) {
            clearInterval(i);
            console.error('No STDIN in 10 seconds, exiting');
            process.exit();
          }
        }, 10000);
      } else {
        resolve(out);
      }
    });
  });

export default getStdin;
