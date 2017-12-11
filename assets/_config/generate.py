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

    def paths_by_section(self):
        from collections import defaultdict
        result = defaultdict(list)
        for target in self.values():
            for path in target.paths:
                result[path.html_section].append(path)

        return result


class Target(object):
    def __init__(self, src):
        self.src = src
        self._get_paths()
        self._get_dep_names()

    def _get_paths(self):
        self.paths = map(Path, self.src['paths'])

    def _get_dep_names(self):
        if 'deps' in self.src:
            self.dep_names = self.src['deps']
        else:
            self.dep_names = []


class Path(object):
    def __init__(self, src):
        self.src = src
        self._get_url()
        self._get_html()

    def _get_url(self):
        if 'local' in self.src:
            self.url = '%s' % self.src['local']
        elif 'npm' in self.src:
            self.url = 'https://unpkg.com/%s' % self.src['npm']
        else:
            raise ValueError("No valid path schemes for %s" % self.src)

    def _get_html(self):
        if self.url.endswith('.js'):
            self.html_section = 'script'
            self.html = '''<script type="text/javascript" src="%s"></script>''' % self.url
        elif self.url.endswith('.jsx'):
            self.html_section = 'script'
            self.html = '''<script type="text/jsx" src="%s"></script>''' % self.url
        elif self.url.endswith('.css'):
            self.html_section = 'style'
            self.html = '''<link rel="stylesheet" href="%s" />''' % self.url
        else:
            raise ValueError("Unsupported extension for %s" % self.src)


def make_parent_dirs(path):
    from errno import EEXIST
    from os import makedirs
    from os.path import dirname, isdir

    try:
        makedirs(dirname(path))
    except OSError as exc:  # Python >2.5
        if exc.errno == EEXIST and isdir(path):
            pass
        else:
            raise


def download_file_with_mkdir(src, dst):
    import urllib2
    opener = urllib2.build_opener()
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    f = opener.open(src)
    content = f.read()
    make_parent_dirs(dst)
    with open(dst, 'wb') as f:
        f.write(content)


def print_order(targets):
    print "Order:"
    print targets.in_dependency_order().keys()
    print


def print_for_unpkg(targets):
    print "Styles:"
    for path in targets.paths_by_section()['style']:
        print path.html
    print

    print "Scripts:"
    for path in targets.paths_by_section()['script']:
        print path.html
    print


def print_for_local(targets):
    for target in targets.values():
        for path in target.paths:
            if "://" in path.url:
                print path.url, '>', '../' + path.src["npm"]
                download_file_with_mkdir(path.url, '../' + path.src["npm"])


def main(input_file):
    targets_src = get_config(input_file)
    targets = Targets(targets_src)
    print_order(targets)
    print_for_unpkg(targets)
    print_for_local(targets)


if __name__ == '__main__':
    from sys import argv
    main(*argv[1:])
