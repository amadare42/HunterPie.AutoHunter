using NUnit.Framework;
using Plugin.AutoHunter.CheatEngine;

namespace Tests.CrownGrinder
{
    [TestFixture]
    public class TableParserTests
    {
        [Test]
        public void CheatTableParse()
        {
            var sut = new CeTableParser();
            sut.LoadTable(421470);
            var entry = sut.GetEntry("MENU_INDEX");
            Assert.NotNull(entry);
        }
    }
}