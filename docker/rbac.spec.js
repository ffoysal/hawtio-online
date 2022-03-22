import rbac from './rbac.js';
import yaml from './js-yaml.js';
import * as fs from 'fs';

rbac.initACL(yaml.safeLoad(fs.readFileSync('./docker/ACL.yaml')));
const listMBeans = JSON.parse(fs.readFileSync('./docker/test.listMBeans.json')).value;

// Roles
const admin = 'admin';
const viewer = 'viewer';

describe('check', function () {
  it('should handle a request with viewer role', function () {
    const result = rbac.check({
      type: 'exec',
      mbean: 'org.apache.camel:type=context',
      operation: 'dumpRoutesAsXml()',
    }, viewer);
    expect(result.allowed).toBe(true);
  });

  it('should handle a request with arguments and no roles allowed', function () {
    const result1 = rbac.check({
      type: 'exec',
      mbean: 'org.apache.karaf:type=bundle',
      operation: 'uninstall(java.lang.String)',
      arguments: [
        '0',
      ],
    }, admin);
    expect(result1.allowed).toBe(false);
    const result2 = rbac.check({
      type: 'exec',
      mbean: 'org.apache.karaf:type=bundle',
      operation: 'uninstall(java.lang.String)',
      arguments: [
        '0',
      ],
    }, viewer);
    expect(result2.allowed).toBe(false);
  });

  it('should handle a request with arguments and only admin allowed', function () {
    const result1 = rbac.check({
      type: 'exec',
      mbean: 'org.apache.karaf:type=bundle',
      operation: 'update(java.lang.String,java.lang.String)',
      arguments: [
        '50',
        'value',
      ],
    }, admin);
    expect(result1.allowed).toBe(true);
    const result2 = rbac.check({
      type: 'exec',
      mbean: 'org.apache.karaf:type=bundle',
      operation: 'update(java.lang.String,java.lang.String)',
      arguments: [
        '50',
        'value',
      ],
    }, viewer);
    expect(result2.allowed).toBe(false);
  });
});

describe('intercept', function () {
  it('should intercept RBAC MBean search requests', function () {
    const result = rbac.intercept(
      {
        type: 'search',
        mbean: '*:type=security,area=jmx,*'
      },
      admin, listMBeans);
    expect(result.intercepted).toBe(true);
    expect(result.response.value).toEqual(['hawtio:type=security,area=jmx,name=HawtioOnlineRBAC']);
  });

  it('should intercept single canInvoke requests on RBAC MBean', function () {
    const result = rbac.intercept(
      {
        type: 'exec',
        mbean: 'hawtio:type=security,area=jmx,name=HawtioOnlineRBAC',
        operation: 'canInvoke(java.lang.String)',
        arguments: ['java.lang:type=Memory']
      },
      admin, listMBeans);
    expect(result.intercepted).toBe(true);
    // canInvoke should be true
    expect(result.response.value).toBe(true);
  });

  it('should intercept bulk canInvoke requests on RBAC MBean', function () {
    const result = rbac.intercept(
      {
        type: 'exec',
        mbean: 'hawtio:type=security,area=jmx,name=HawtioOnlineRBAC',
        operation: 'canInvoke(java.util.Map)',
        'arguments': [
          {
            'java.lang:type=Memory': [
              'gc()',
            ],
            'org.apache.camel:context=io.fabric8.quickstarts.karaf-camel-log-log-example-context,name="log-example-context",type=context': [
              'addOrUpdateRoutesFromXml(java.lang.String)',
              'addOrUpdateRoutesFromXml(java.lang.String,boolean)',
              'dumpStatsAsXml(boolean)',
              'getCamelId()',
              'getRedeliveries()',
              'sendStringBody(java.lang.String,java.lang.String)',
            ],
          },
        ],
      },
      admin, listMBeans);
    expect(result.intercepted).toBe(true);
    expect(result.response.value).toBeDefined();
    // canInvoke should be ???
  });

  it('should not intercept other requests', function () {
    const result = rbac.intercept(
      {
        type: 'exec',
        mbean: 'java.lang.Memory',
        operation: 'gc()',
      },
      admin, listMBeans);
    expect(result.intercepted).toBe(false);
    expect(result.response).toBeUndefined();
  });
});