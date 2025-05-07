import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    console.log(data);

    return data;
  }

function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          configurable:false,
          writeable:false,
          enumerable:false,
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });

        return ret;
      });
  }

  function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total&nbsp;<abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Add more stats as needed...
    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' }),
      );

    const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

    dl.append('dt').text('Working Hours');
    dl.append('dd').text(maxPeriod);

    dl.append('dt').text('Authors');
    dl.append('dd').text(d3.groups(data, d => d.author).length);

    const fileLengths = d3.rollups(
        data,
        (v) => d3.max(v, (v) => v.line),
        (d) => d.length,
      );
    
    console.log(fileLengths);

    const maxLineLength = d3.greatest(fileLengths, (d) => d[0])[0];

    console.log(maxLineLength)

    dl.append('dt').text('Longest Line');
    dl.append('dd').text(maxLineLength);

    dl.append('dt').text('Files');
    dl.append('dd').text(d3.groups(data, d => d.file).length);
  }
  
  let data = await loadData();
  let commits = processCommits(data);
  console.log(commits);
  
  renderCommitInfo(data, commits);