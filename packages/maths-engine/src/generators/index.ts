/**
 * Every generator, registered.
 *
 * The coverage test asserts that this registry has at least one generator for each of the 97
 * DfE content references, so a reference cannot be dropped without the suite failing.
 */
import n01 from './number/n01.js';
import n02 from './number/n02.js';
import n03 from './number/n03.js';
import n04 from './number/n04.js';
import n05 from './number/n05.js';
import n06 from './number/n06.js';
import n07 from './number/n07.js';
import n08 from './number/n08.js';
import n09 from './number/n09.js';
import n10 from './number/n10.js';
import n11 from './number/n11.js';
import n12 from './number/n12.js';
import n13 from './number/n13.js';
import n14 from './number/n14.js';
import n15 from './number/n15.js';
import n16 from './number/n16.js';
import a01 from './algebra/a01.js';
import a02 from './algebra/a02.js';
import a03 from './algebra/a03.js';
import a04 from './algebra/a04.js';
import a05 from './algebra/a05.js';
import a06 from './algebra/a06.js';
import a07 from './algebra/a07.js';
import a08 from './algebra/a08.js';
import a09 from './algebra/a09.js';
import a10 from './algebra/a10.js';
import a11 from './algebra/a11.js';
import a12 from './algebra/a12.js';
import a13 from './algebra/a13.js';
import a14 from './algebra/a14.js';
import a15 from './algebra/a15.js';
import a16 from './algebra/a16.js';
import a17 from './algebra/a17.js';
import a18 from './algebra/a18.js';
import a19 from './algebra/a19.js';
import a20 from './algebra/a20.js';
import a21 from './algebra/a21.js';
import a22 from './algebra/a22.js';
import a23 from './algebra/a23.js';
import a24 from './algebra/a24.js';
import a25 from './algebra/a25.js';
import r01 from './ratio/r01.js';
import r02 from './ratio/r02.js';
import r03 from './ratio/r03.js';
import r04 from './ratio/r04.js';
import r05 from './ratio/r05.js';
import r06 from './ratio/r06.js';
import r07 from './ratio/r07.js';
import r08 from './ratio/r08.js';
import r09 from './ratio/r09.js';
import r10 from './ratio/r10.js';
import r11 from './ratio/r11.js';
import r12 from './ratio/r12.js';
import r13 from './ratio/r13.js';
import r14 from './ratio/r14.js';
import r15 from './ratio/r15.js';
import r16 from './ratio/r16.js';
import g01 from './geometry/g01.js';
import g02 from './geometry/g02.js';
import g03 from './geometry/g03.js';
import g04 from './geometry/g04.js';
import g05 from './geometry/g05.js';
import g06 from './geometry/g06.js';
import g07 from './geometry/g07.js';
import g08 from './geometry/g08.js';
import g09 from './geometry/g09.js';
import g10 from './geometry/g10.js';
import g11 from './geometry/g11.js';
import g12 from './geometry/g12.js';
import g13 from './geometry/g13.js';
import g14 from './geometry/g14.js';
import g15 from './geometry/g15.js';
import g16 from './geometry/g16.js';
import g17 from './geometry/g17.js';
import g18 from './geometry/g18.js';
import g19 from './geometry/g19.js';
import g20 from './geometry/g20.js';
import g21 from './geometry/g21.js';
import g22 from './geometry/g22.js';
import g23 from './geometry/g23.js';
import g24 from './geometry/g24.js';
import g25 from './geometry/g25.js';
import p01 from './probability/p01.js';
import p02 from './probability/p02.js';
import p03 from './probability/p03.js';
import p04 from './probability/p04.js';
import p05 from './probability/p05.js';
import p06 from './probability/p06.js';
import p07 from './probability/p07.js';
import p08 from './probability/p08.js';
import p09 from './probability/p09.js';
import s01 from './statistics/s01.js';
import s02 from './statistics/s02.js';
import s03 from './statistics/s03.js';
import s04 from './statistics/s04.js';
import s05 from './statistics/s05.js';
import s06 from './statistics/s06.js';
import { GeneratorRegistry } from '../core/registry.js';
import type { QuestionGenerator } from '../core/generator.js';

export const ALL_GENERATORS: QuestionGenerator[] = [
  ...n01,
  ...n02,
  ...n03,
  ...n04,
  ...n05,
  ...n06,
  ...n07,
  ...n08,
  ...n09,
  ...n10,
  ...n11,
  ...n12,
  ...n13,
  ...n14,
  ...n15,
  ...n16,
  ...a01,
  ...a02,
  ...a03,
  ...a04,
  ...a05,
  ...a06,
  ...a07,
  ...a08,
  ...a09,
  ...a10,
  ...a11,
  ...a12,
  ...a13,
  ...a14,
  ...a15,
  ...a16,
  ...a17,
  ...a18,
  ...a19,
  ...a20,
  ...a21,
  ...a22,
  ...a23,
  ...a24,
  ...a25,
  ...r01,
  ...r02,
  ...r03,
  ...r04,
  ...r05,
  ...r06,
  ...r07,
  ...r08,
  ...r09,
  ...r10,
  ...r11,
  ...r12,
  ...r13,
  ...r14,
  ...r15,
  ...r16,
  ...g01,
  ...g02,
  ...g03,
  ...g04,
  ...g05,
  ...g06,
  ...g07,
  ...g08,
  ...g09,
  ...g10,
  ...g11,
  ...g12,
  ...g13,
  ...g14,
  ...g15,
  ...g16,
  ...g17,
  ...g18,
  ...g19,
  ...g20,
  ...g21,
  ...g22,
  ...g23,
  ...g24,
  ...g25,
  ...p01,
  ...p02,
  ...p03,
  ...p04,
  ...p05,
  ...p06,
  ...p07,
  ...p08,
  ...p09,
  ...s01,
  ...s02,
  ...s03,
  ...s04,
  ...s05,
  ...s06,
];

export const registry = new GeneratorRegistry().register(...ALL_GENERATORS);
