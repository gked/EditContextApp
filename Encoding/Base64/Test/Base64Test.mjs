// Code adapted from MIT-licensed https://github.com/niklasvh/base64-arraybuffer
import Base64 from "../Base64.mjs"

function stringArrayBuffer(str) {
  const buffer = new ArrayBuffer(str.length);
  const bytes = new Uint8Array(buffer);

  str.split('').forEach(function(str, i) {
    bytes[i] = str.charCodeAt(0);
  });

  return buffer;
}

function testArrayBuffers(buffer1, buffer2) {
  const len1 = buffer1.byteLength;
  const len2 = buffer2.byteLength;
  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);

  if (len1 !== len2) {
    return false;
  }

  for (let i = 0; i < len1; i++) {
    if (view1[i] === undefined || view1[i] !== view2[i]) {
      return false;
    }
  }
  return true;
}

function rangeArrayBuffer() {
  const buffer = new ArrayBuffer(256);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < 256; i++) {
    bytes[i] = i
  }

  return buffer;
}

test(() => {
  assert_equals(Base64.encode(stringArrayBuffer("Hello world")), "SGVsbG8gd29ybGQ=");
}, 'encode "Hello world"');

test(() => {
  assert_equals(Base64.encode(stringArrayBuffer("Man")), "TWFu");
}, 'encode "Man"');

test(() => {
  assert_equals(Base64.encode(stringArrayBuffer("Ma")), "TWE=");
}, 'encode "Ma"');

test(() => {
  assert_equals(Base64.encode(stringArrayBuffer("Hello worlds!")), "SGVsbG8gd29ybGRzIQ==");
}, 'encode "Hello worlds!"');

test(() => {
  assert_equals(Base64.encode(rangeArrayBuffer()), "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==");
}, 'encode all binary characters');

test(() => {
  assert_true(testArrayBuffers(Base64.decode("TWFu"), stringArrayBuffer("Man")));
}, 'decode "Man"');

test(() => {
  assert_true(testArrayBuffers(Base64.decode("SGVsbG8gd29ybGQ="), stringArrayBuffer("Hello world")));
}, 'decode "Hello world"');

test(() => {
  assert_true(testArrayBuffers(Base64.decode("SGVsbG8gd29ybGRzIQ=="), stringArrayBuffer("Hello worlds!")));
}, 'decode "Hello worlds!"');

test(() => {
  assert_true(testArrayBuffers(Base64.decode("AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=="), rangeArrayBuffer()));
}, 'decode all binary characters');
