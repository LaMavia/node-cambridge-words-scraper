# Cambridge Dictionary words scraper
## Motivation
I got tierd of doing it on my own. That's it.
## Usage
1. Download a release for your operating system.
    1. Go to the *Releases* tab above
1. Create an input file with the words separated new lines (`enter`).
1. Run the executable from the cli with the following arguments
  ```
  ./node-word-scraper 
    -input <the_path_to_the_input_file. i.e.: /path/to/file/input.txt (default: input.txt)> 
    -limit <the limit of definitions per word. i.e.: 20 (default: 3)>
  ```