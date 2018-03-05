interface Props {
  onLoad?: (el: React.ReactNode) => void;
  onUnload?: (el: React.ReactNode) => void;
}

class PromisedElement {
  lastEl: React.ReactNode;
  onLoad?: (el: React.ReactNode) => void;
  onUnload?: (el: React.ReactNode) => void;
  resolve: (el: React.ReactNode) => void;
  reject: () => void;
  promise: Promise<React.ReactNode>;

  constructor(props?: Props) {
    if (props) {
      let {onLoad, onUnload} = props;
      this.onLoad = onLoad;
      this.onUnload = onUnload;
    }

    this.receive = this.receive.bind(this);

    this.lastEl = null;
    this.resetPromise();
  }

  resetPromise() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  receive(el: React.ReactNode) {
    if (el !== this.lastEl) {
      // Note that order of the `if`s is important. A changing element is
      // treated as if it disappeared and then reappeared. Note that in our
      // current use case (React), elements won't change in this way -- they'll
      // change to null before reappearing.
      if (this.lastEl != null) {
        // The element disapppeared.
        this.reject();
        this.resetPromise();
        if (this.onUnload) {
          this.onUnload(this.lastEl);
        }
      }
      if (el != null) {
        // The element appeared.
        this.resolve(el);
        if (this.onLoad) {
          this.onLoad(el);
        }
      }
    }
    this.lastEl = el;
  }

  get() {
    return this.promise;
  }
}

export default PromisedElement;
