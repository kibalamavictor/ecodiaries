/**
 * Regression test: rich text must never leak raw Lexical JSON keys.
 * Run: npm run test:richtext
 */
import assert from 'node:assert/strict'
import { paragraphsToLexical } from '../../scripts/launch-content'
import { lexicalToPlainText } from './richtext'

const brokenSample = paragraphsToLexical(
  'Replacing diesel irrigation pumps with solar-powered alternatives eliminates fuel costs.',
  '**How it works**\nSubmersible solar pumps draw groundwater during daylight hours.',
)

const plain = lexicalToPlainText(brokenSample)

assert.ok(!plain.includes('root type'), `should not leak Lexical internals, got: ${plain.slice(0, 120)}`)
assert.ok(!plain.includes('format indent'), `should not leak format keys, got: ${plain.slice(0, 120)}`)
assert.ok(plain.includes('How it works'), 'should preserve heading text')
assert.ok(plain.includes('Submersible solar pumps'), 'should preserve body text')

console.log('richtext.test.ts — all assertions passed')
