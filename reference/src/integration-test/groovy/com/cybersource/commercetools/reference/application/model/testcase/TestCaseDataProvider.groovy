package com.cybersource.commercetools.reference.application.model.testcase

import groovy.io.FileType
import groovy.json.JsonSlurper

@SuppressWarnings('JavaIoPackageAccess')
class TestCaseDataProvider implements Iterable<TestCase> {

    String path

    TestCaseDataProvider(String path) {
        this.path = path
    }

    @Override
    Iterator<String> iterator() {
        def testCases = []
        if (path.endsWith('.json')) {
            def file = new File(getClass().getResource(path).toURI())
            testCases.add(readTestCase(file))
        } else {
            new File(getClass().getResource(path).toURI()).eachFileRecurse(FileType.FILES) { file ->
                if (file.name.endsWith('.json')) {
                    testCases.add(readTestCase(file))
                }
            }
        }

        testCases.iterator()
    }

    def readTestCase(File file) {
        def map = new JsonSlurper().parse(file)
        new TestCase(map)
    }

}
