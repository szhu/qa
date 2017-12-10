#!/usr/bin/env python

import yaml

def get_config(input_file):
    with open(input_file, 'r') as f:
        return yaml.load(f)


class Targets(dict):
    def __init__(self, src):
        for target_name, target_src in src.iteritems():
            target = Target(target_src)
            self[target_name] = target

    def in_dependency_order(self):
        results = []
        todo = list(sorted(self))
        while todo:
            current = todo.pop(0)

            insert_to_front = []
            for dep in self[current].dep_names:
                if dep in todo:
                    todo.remove(dep)
                    insert_to_front.append(dep)
            if insert_to_front:
                todo = insert_to_front + [current] + todo
            else:
                results.append(current)

        from collections import OrderedDict
        return OrderedDict((key, self[key]) for key in results)


class Target(object):
    def __init__(self, src):
        self.src = src
        self.paths = self.src['paths']
        self.dep_names = self.src['deps'] if 'deps' in self.src else []


def convert_path(src):
    if 'local' in src:
        url = '%s' % src['local']
    elif 'npm' in src:
        url = 'https://unpkg.com/%s' % src['npm']
    else:
        raise ValueError("No valid path schemes for %s" % src)

    if url.endswith('.js'):
        return 'script', '''<script type="text/javascript" src="%s"></script>''' % url
    elif url.endswith('.jsx'):
        return 'script', '''<script type="text/jsx" src="%s"></script>''' % url
    elif url.endswith('.css'):
        return 'style', '''<link rel="stylesheet" href="%s" />''' % url
    else:
        raise ValueError("Unsupported extension for %s" % src)


def collect_html_sections(htmls):
    from collections import defaultdict
    result = defaultdict(list)
    for type, html in htmls:
        result[type].append(html)
    return result


def convert_paths_from_targets(targets):
    for target_name, target in targets.in_dependency_order().iteritems():
        for path in target.paths:
            yield convert_path(path)


def main(input_file):
    targets_src = get_config(input_file)
    targets = Targets(targets_src)
    print "Order:"
    print targets.in_dependency_order().keys()
    print

    html_stuff = collect_html_sections(convert_paths_from_targets(targets))

    print "Styles:"
    for html in html_stuff['style']:
        print html
    print

    print "Scripts:"
    for html in html_stuff['script']:
        print html

if __name__ == '__main__':
    from sys import argv
    main(*argv[1:])
