import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import IKImage from '../components/IKImage';
import IntersectionObserverMock from './mocks/IntersectionObserverMock';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const relativePath = 'default-image.jpg';
const absolutePath = `${urlEndpoint}/${relativePath}`;
const absolutePathWithQuery = `${absolutePath}?foo=bar`
const nestedImagePath = '/sample-folder/default-image.jpg';

describe('IKImage', () => {
  describe('Snapshots', () => {
    describe('Absolute image path', () => {
      test("src with alt attribute", () => {
        const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePath} alt={'some text here'} />);

        expect(ikImage.find('img').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
        expect(ikImage.find('img').prop('alt')).toEqual('some text here');

      });

      test("src with query parameters", () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            src={absolutePathWithQuery}
            queryParameters={{ version: 5, name: 'check' }}
          />
        );

        const transformURL = `${absolutePathWithQuery}&${global.SDK_VERSION}&version=5&name=check`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test("src with transformation", () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            src={absolutePath}
            transformation={[{
              height: 300,
              width: 400
            }]} />
        );

        const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test("src with lqip", () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} id="lqip" />
        );

        const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=q-20%2Cbl-6`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test("src with transformation and lqip", () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            lqip={{ active: true, quality: 20 }}
            src={absolutePath}
            transformation={[{
              height: 300,
              width: 400
            }]}
            id="lqip"
          />
        );

        const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400%3Aq-20%2Cbl-6`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });
    });

    describe('Relative image path', () => {
      test("path with alt attribute", () => {
        const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} alt={'some text here'} />);

        expect(ikImage.find('img').prop('src')).toEqual(`${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`);
        expect(ikImage.find('img').prop('alt')).toEqual('some text here');
      });

      test("path with query parameters", () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} queryParameters={{ version: 5, name: 'check' }} />
        );

        const transformURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}&version=5&name=check`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test("path having leading slashes", () => {
        const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path="////default-image.jpg" />);

        expect(ikImage.find('img').prop('src')).toEqual(`${urlEndpoint}/default-image.jpg?${global.SDK_VERSION}`);
      });

      test("path with url endpoint having trailing slashes", () => {
        const ikImage = shallow(
          <IKImage urlEndpoint="http://ik.imagekit.io/test_imagekit_id////" path={relativePath} />
        );

        expect(ikImage.find('img').prop('src')).toEqual(`http://ik.imagekit.io/test_imagekit_id/${relativePath}?${global.SDK_VERSION}`);
      });

      test("path with lqip", () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} id="lqip" />
        );

        const transformURL = `${urlEndpoint}/tr:q-20,bl-6/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
        expect(ikImage.find('img').prop('id')).toEqual('lqip');
      });

      test("path with transformations", () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            height: 300,
            width: 400
          }]} />
        );

        const transformURL = `${urlEndpoint}/tr:h-300,w-400/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test("path with transformations and lqip", () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            lqip={{ active: true, quality: 20 }}
            path={relativePath}
            transformation={[{
              height: 300,
              width: 400
            }]}
            id="lqip"
          />
        );

        const transformURL = `${urlEndpoint}/tr:h-300,w-400:q-20,bl-6/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
        expect(ikImage.find('img').prop('id')).toEqual('lqip');
      });

      test("nested path with lqip", () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            lqip={{ active: true, quality: 50, blur: 25 }}
            path={nestedImagePath}
            transformation={[{
              height: 300,
              width: 400
            }]}
            id="lqip"
          />
        );

        const transformURL = `${urlEndpoint}/tr:h-300,w-400:q-50,bl-25${nestedImagePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
        expect(ikImage.find('img').prop('id')).toEqual('lqip');
      });
    });

    describe('Transformation', () => {
      test('single transformation', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            height: 300
          }]} />
        );

        const transformURL = `${urlEndpoint}/tr:h-300/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('transformation position as query', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            height: 300,
            width: 400
          }]} transformationPosition="query" />
        );

        const transformURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('transformation position as path while using relative image path', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            height: 300,
            width: 400
          }]} transformationPosition="path" />
        );

        const transformURL = `${urlEndpoint}/tr:h-300,w-400/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('transformation position as path while using absolute image path', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} src={absolutePath} transformation={[{
            height: 300,
            width: 400
          }]} transformationPosition="path" />
        );

        const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('chained transformations', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            height: 300,
            width: 400
          }, {
            'rotation': 90
          }]} />
        );

        const transformURL = `${urlEndpoint}/tr:h-300,w-400:rt-90/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('non-existent transformation', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            'foo': 'bar',
          }]} />
        );

        const transformURL = `${urlEndpoint}/tr:foo-bar/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });

      test('non-existent transformation with existing transformation', () => {
        const ikImage = shallow(
          <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
            'foo': 'bar',
            height: 300
          }]} />
        );

        const transformURL = `${urlEndpoint}/tr:foo-bar,h-300/${relativePath}?${global.SDK_VERSION}`;
        expect(ikImage.find('img').prop('src')).toEqual(transformURL);
      });
    });
  });

  describe('Component lifecycle', () => {
    describe('Lazy loading', () => {
      // spies
      const observeSpy = sinon.spy();
      let intersectionObserverSpy;
      let originalNavigatorPrototype;

      const mockNavigator = (effectiveType = '4g') => {
        // backup original connection value
        originalNavigatorPrototype = Object.getOwnPropertyDescriptor(global.Navigator.prototype, 'connection');

        // mock connection
        Object.defineProperty(global.Navigator.prototype, 'connection', {
          get: function () {
            return { effectiveType };
          },
          configurable: true
        });
      };

      const restoreNavigator = () => {
        const navigatorConnection = originalNavigatorPrototype || {
          get: function () { },
          configurable: true
        };

        Object.defineProperty(global.Navigator.prototype, 'connection', navigatorConnection);
      }

      beforeEach(() => {
        IntersectionObserverMock({ observe: observeSpy });
        intersectionObserverSpy = sinon.spy(window, 'IntersectionObserver');
      });

      afterEach(() => {
        intersectionObserverSpy.restore();
        observeSpy.resetHistory();
      });

      test('image should have empty src initially when marked for lazy loading', () => {
        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
          />
        );

        expect(ikImage.find('img').prop('src')).toEqual('');
      });

      test('image should have actual src when element is intersected', () => {
        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
          />
        );

        // verify that src is blank initially
        expect(ikImage.find('img').prop('src')).toEqual('');

        // verify mocks were called
        expect(observeSpy.calledOnce).toEqual(true);
        expect(intersectionObserverSpy.calledOnce).toEqual(true);

        // trigger element intersection callback
        intersectionObserverSpy.args[0][0]([{ isIntersecting: true }]);
        // update wrapper
        ikImage.update();

        const lazyLoadedURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(lazyLoadedURL);
      });

      test('intersection observer should disconnect when component unmounts', () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
          />
        );
        // spies
        const spy = sinon.spy(ikImage.instance(), 'componentWillUnmount');
        expect(spy.called).toEqual(false);
        const observerStub = { observe: { disconnect: sinon.spy() } };
        ikImage.setState(observerStub);

        // trigger unmount
        ikImage.unmount();

        // verify spies
        expect(spy.calledOnce).toEqual(true);
        expect(observerStub.observe.disconnect.called).toEqual(true);
        spy.restore();
      });

      test('should set smaller threshold margin for fast connections', () => {
        // mock fast network connection
        mockNavigator('4g');

        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
          />
        );

        // verify that src is blank initially
        expect(ikImage.find('img').prop('src')).toEqual('')

        // verify mocks were called
        expect(observeSpy.calledOnce).toEqual(true);
        expect(intersectionObserverSpy.calledOnce).toEqual(true);

        // check rootMargin
        expect(intersectionObserverSpy.args[0][1].rootMargin).toEqual('1250px 0px 1250px 0px')

        // trigger element intersection callback
        intersectionObserverSpy.args[0][0]([{ isIntersecting: true }]);
        // update wrapper
        ikImage.update();

        const lazyLoadedURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(lazyLoadedURL);

        restoreNavigator();
      });

      test('should set larger threshold margin for slower connections', () => {
        // mock slow network connection
        mockNavigator('2g');

        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
          />
        );

        // verify that src is blank initially
        expect(ikImage.find('img').prop('src')).toEqual('')

        // verify mocks were called
        expect(observeSpy.calledOnce).toEqual(true);
        expect(intersectionObserverSpy.calledOnce).toEqual(true);

        // check rootMargin
        expect(intersectionObserverSpy.args[0][1].rootMargin).toEqual('2500px 0px 2500px 0px')

        // trigger element intersection callback
        intersectionObserverSpy.args[0][0]([{ isIntersecting: true }]);
        // update wrapper
        ikImage.update();

        const lazyLoadedURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(lazyLoadedURL);

        restoreNavigator();
      });
    });

    describe('LQIP', () => {
      // spies
      const observeSpy = sinon.spy();
      let intersectionObserverSpy;

      let originalImagePrototype;
      let imageOnload = null;

      const stubImagePrototype = () => {
        Object.defineProperty(global.Image.prototype, 'onload', {
          get: function () {
            return this._onload;
          },
          set: function (fn) {
            imageOnload = fn;
            this._onload = fn;
          },
          configurable: true
        });
      };

      beforeEach(() => {
        IntersectionObserverMock({ observe: observeSpy });
        intersectionObserverSpy = sinon.spy(window, 'IntersectionObserver');

        // backup the original Image.prototype.src
        originalImagePrototype = Object.getOwnPropertyDescriptor(global.Image.prototype, 'src');

        stubImagePrototype();
      });

      afterEach(() => {
        intersectionObserverSpy.restore();
        observeSpy.resetHistory();

        // restore the original Image.prototype.src
        Object.defineProperty(global.Image.prototype, 'src', originalImagePrototype);
      });

      test('image with lqip should have actual src when element is loaded', () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            lqip={{ active: true }}
          />
        );

        const initialURL = `${urlEndpoint}/tr:q-20,bl-6/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(initialURL);

        imageOnload();

        const expectedURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(expectedURL);
      });

      test('image with lqip and lazy loading should have actual src when element is intersected and loaded', () => {
        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
            lqip={{ active: true }}
          />
        );

        expect(observeSpy.calledOnce).toEqual(true);
        expect(intersectionObserverSpy.calledOnce).toEqual(true);

        // trigger element intersection callback
        intersectionObserverSpy.args[0][0]([{ isIntersecting: true }]);
        ikImage.update();

        const lazyLoadedURL = `${urlEndpoint}/tr:q-20,bl-6/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(lazyLoadedURL);

        // simulate image onload
        imageOnload();
        ikImage.update();

        const fullyLoadedURL = `${urlEndpoint}/${relativePath}?${global.SDK_VERSION}`
        expect(ikImage.find('img').prop('src')).toEqual(fullyLoadedURL);
      });

      test('should not work for image with lqip active key set to false and lazy loading enabled', () => {
        const ikImage = mount(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
            loading="lazy"
            lqip={{ active: false }}
          />
        );

        expect(observeSpy.calledOnce).toEqual(true);
        expect(intersectionObserverSpy.calledOnce).toEqual(true);

        expect(ikImage.find('img').prop('src')).toBeUndefined();

        // trigger element intersection callback
        intersectionObserverSpy.args[0][0]([{ isIntersecting: true }]);
        ikImage.update();

        expect(ikImage.find('img').prop('src')).toBeUndefined();
      });
    });

    describe('Miscellaneous', () => {
      // covers 'else' condition for observer disconnection in non-lazyload cases
      test('IKImage should unmount properly', () => {
        const ikImage = shallow(
          <IKImage
            urlEndpoint={urlEndpoint}
            path={relativePath}
          />
        );
        // spies
        const spy = sinon.spy(ikImage.instance(), 'componentWillUnmount');
        expect(spy.called).toEqual(false);

        // trigger unmount
        ikImage.unmount();

        // verify spies
        expect(spy.calledOnce).toEqual(true);
        spy.restore();

        expect(ikImage.find('img').length).toEqual(0);
      });
    });
  });
});
