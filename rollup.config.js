import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const input = ["src/index.js"];
const dynamicRequireTargets = [
  "src/methods/*.js", 
  "!src/methods/index.js"
];


export default createConfig(process.env.NODE_ENV);


function createConfig(env) {
  const ext = env === "production" ? "min.js" : "js";
  const plugins = [
    nodeResolve(),
    commonjs({ dynamicRequireTargets }),
    babel({ babelHelpers: "bundled" }),
  ];
  const productionPlugins = [];

  if(env === "production") {
    productionPlugins.push(terser());
  }

  return [
    
    // UMD
    {
      input,
      plugins: [...plugins, ...productionPlugins ],
      output: {
        file: `dist/${pkg.name}.${ext}`,
        format: "umd",
        name: "SmartFormValidator", // this is the name of the global object
        esModule: false,
        exports: "default",
        sourcemap: true,
      },
    },

    // ES Module
    {
      input,
      plugins,
      output: [
        {
          file: `dist/esm/${pkg.name}.js`,
          format: "esm",
          exports: "default",
          sourcemap: true,
        },
      ],
    },

    // Common JS
    {
      input,
      plugins: [ 
        nodeResolve(),
        commonjs({ strictRequires: true }), 
        babel({ babelHelpers: "bundled" }),
      ],
      output: [
        {
          file: `dist/cjs/${pkg.name}.js`,
          format: "cjs",
          exports: "default",
          sourcemap: true,
        },
      ],
    },
  ];
}
